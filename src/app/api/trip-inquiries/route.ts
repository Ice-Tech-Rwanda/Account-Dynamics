import { NextResponse } from "next/server";
import { parseParams, created, serverError } from "@/lib/api-helpers";
import { tripInquirySchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/services/notifications";
import { notifyAdminOfLead, sendLeadConfirmation } from "@/lib/services/email";
import { getSiteSettings } from "@/lib/content/service.server";
import { logger } from "@/lib/logger";
import { isFormAllowed } from "@/lib/localRateLimiter";
import { claimIdempotency, releaseIdempotency } from "@/lib/idempotency";
import { validateOrigin } from "@/lib/csrf";

// Simple spam detection: reject if the submission contains suspicious patterns.
function isSpam(data: { name: string; email: string; message?: string | null }): boolean {
  const text = `${data.name} ${data.email} ${data.message ?? ""}`.toLowerCase();
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|congratulations|click here|act now)\b/i,
    /(http[s]?:\/\/[^\s]+){3,}/i,
    /<script/i,
  ];
  return spamPatterns.some((p) => p.test(text));
}

export async function POST(request: Request) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) {
    return NextResponse.json({ error: "Request rejected" }, { status: 403 });
  }

  if (!(await isFormAllowed(request, "trip-inquiry"))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let idemKey = "";

  try {
    const body = await request.json();
    const parsed = parseParams(tripInquirySchema, body);
    if (!parsed.success) return parsed.error;
    idemKey = parsed.data.idempotencyKey ?? "";

    if (idemKey && !claimIdempotency("trip-inquiry", idemKey)) {
      return NextResponse.json(
        { ok: true, duplicate: true, message: "This trip request was already received." },
        { status: 200 }
      );
    }

    if (isSpam(parsed.data)) {
      logger.info("Spam trip inquiry rejected", { email: parsed.data.email });
      return created({ ok: true, spam: true });
    }

    const settings = await getSiteSettings();

    const inquiry = await prisma.tripInquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        country: parsed.data.country ?? null,
        travelDate: parsed.data.travelDate ?? null,
        duration: parsed.data.duration ?? null,
        travelers: parsed.data.travelers ?? null,
        preferredPackage: parsed.data.preferredPackage ?? null,
        budget: parsed.data.budget ?? null,
        destination: parsed.data.destination ?? null,
        message: parsed.data.message ?? null,
        status: "NEW",
      },
    });

    await notifyAdmins({
      type: "inquiry",
      title: `New trip request from ${parsed.data.name}`,
      message: parsed.data.preferredPackage ?? parsed.data.destination ?? "General trip inquiry",
      link: `/admin/trip-inquiries`,
    });

    try {
      await notifyAdminOfLead(
        {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          service: parsed.data.preferredPackage ?? "Trip planning",
          type: "inquiry",
          createdAt: new Date(),
          message: parsed.data.message,
          extra: {
            Country: parsed.data.country,
            Destination: parsed.data.destination,
            "Travel date": parsed.data.travelDate,
            Duration: parsed.data.duration,
            Travelers: parsed.data.travelers,
            Budget: parsed.data.budget,
          },
        },
        settings.adminEmail
      );
      await sendLeadConfirmation(parsed.data.email, "inquiry");
    } catch {
      // non-critical
    }

    return created(inquiry);
  } catch (error) {
    if (idemKey) releaseIdempotency("trip-inquiry", idemKey);
    logger.error("Failed to create trip inquiry", { error: String(error) });
    return serverError();
  }
}