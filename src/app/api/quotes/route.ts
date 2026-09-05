import { NextResponse } from "next/server";
import { parseParams, created, serverError } from "@/lib/api-helpers";
import { quoteSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/services/notifications";
import { notifyAdminOfLead, sendLeadConfirmation } from "@/lib/services/email";
import { getSiteSettings } from "@/lib/content/service.server";
import { logger } from "@/lib/logger";
import { isFormAllowed } from "@/lib/localRateLimiter";
import { claimIdempotency, releaseIdempotency } from "@/lib/idempotency";
import { validateOrigin } from "@/lib/csrf";

// Simple spam detection: reject if message contains suspicious patterns
function isSpam(data: { name: string; email: string; message?: string | null }): boolean {
  const text = `${data.name} ${data.email} ${data.message ?? ""}`.toLowerCase();
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|congratulations|click here|act now)\b/i,
    /(http[s]?:\/\/[^\s]+){3,}/i, // multiple URLs
    /<script/i,
  ];
  return spamPatterns.some((p) => p.test(text));
}

export async function POST(request: Request) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) {
    return NextResponse.json({ error: "Request rejected" }, { status: 403 });
  }

  if (!(await isFormAllowed(request, "quote"))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let idemKey = "";

  try {
    const body = await request.json();
    const parsed = parseParams(quoteSchema, body);
    if (!parsed.success) return parsed.error;
    idemKey = parsed.data.idempotencyKey ?? "";

    // Idempotency: a second submission with the same key is a duplicate.
    if (idemKey && !claimIdempotency("quote", idemKey)) {
      return NextResponse.json(
        { ok: true, duplicate: true, message: "This quote request was already received." },
        { status: 200 }
      );
    }

    // Basic spam detection
    if (isSpam(parsed.data)) {
      logger.info("Spam quote request rejected", { email: parsed.data.email });
      // Return success to avoid tipping off spammers
      return created({ ok: true, spam: true });
    }

    const settings = await getSiteSettings();

    const quote = await prisma.quoteRequest.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        company: parsed.data.company ?? null,
        service: parsed.data.service ?? null,
        businessType: parsed.data.businessType ?? null,
        message: parsed.data.message ?? null,
        preferredContact: parsed.data.preferredContact,
        status: "NEW",
      },
    });

    await notifyAdmins({
      type: "quote",
      title: `New quote request from ${parsed.data.name}`,
      message: parsed.data.service ?? "General",
      link: `/admin/quotes/${quote.id}`,
    });

    try {
      const data = {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        company: parsed.data.company,
        service: parsed.data.service,
        type: "quote" as const,
        createdAt: new Date(),
        message: parsed.data.message,
      };
      await notifyAdminOfLead(data, settings.adminEmail);
      await sendLeadConfirmation(parsed.data.email, "quote", parsed.data.preferredContact);
    } catch {
      // non-critical
    }

    return created(quote);
  } catch (error) {
    // A failed request releases the claim so a genuine retry can proceed.
    if (idemKey) releaseIdempotency("quote", idemKey);
    logger.error("Failed to create quote request", { error: String(error) });
    return serverError();
  }
}
