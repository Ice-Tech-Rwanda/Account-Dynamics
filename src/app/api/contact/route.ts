import { NextResponse } from "next/server";
import { parseParams, created, serverError } from "@/lib/api-helpers";
import { contactSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/services/notifications";
import { notifyAdminOfLead, sendLeadConfirmation } from "@/lib/services/email";
import { getSiteSettings } from "@/lib/content/service.server";
import { logger } from "@/lib/logger";
import { isFormAllowed } from "@/lib/localRateLimiter";
import { claimIdempotency, releaseIdempotency } from "@/lib/idempotency";
import { validateOrigin } from "@/lib/csrf";

export async function POST(request: Request) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) {
    return NextResponse.json({ error: "Request rejected" }, { status: 403 });
  }

  if (!(await isFormAllowed(request, "contact"))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let idemKey = "";

  try {
    const body = await request.json();
    const parsed = parseParams(contactSchema, body);
    if (!parsed.success) return parsed.error;
    idemKey = parsed.data.idempotencyKey ?? "";

    // Idempotency: a second submission with the same key is a duplicate.
    if (idemKey && !claimIdempotency("contact", idemKey)) {
      return NextResponse.json(
        { ok: true, duplicate: true, message: "This message was already received." },
        { status: 200 }
      );
    }

    const settings = await getSiteSettings();

    const inquiry = await prisma.inquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        company: parsed.data.company ?? null,
        service: parsed.data.service ?? null,
        message: parsed.data.message,
        status: "NEW",
        source: "contact",
      },
    });

    await notifyAdmins({
      type: "inquiry",
      title: `New inquiry from ${parsed.data.name}`,
      message: parsed.data.message,
      link: `/admin/inquiries/${inquiry.id}`,
    });

    try {
      const data = {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        company: parsed.data.company,
        service: parsed.data.service,
        type: "inquiry" as const,
        createdAt: new Date(),
        message: parsed.data.message,
      };
      await notifyAdminOfLead(data, settings.adminEmail);
      await sendLeadConfirmation(parsed.data.email, "inquiry");
    } catch {
      // non-critical
    }

    return created(inquiry);
  } catch (error) {
    // A failed request releases the claim so a genuine retry can proceed.
    if (idemKey) releaseIdempotency("contact", idemKey);
    logger.error("Failed to send contact message", { error: String(error) });
    return serverError();
  }
}
