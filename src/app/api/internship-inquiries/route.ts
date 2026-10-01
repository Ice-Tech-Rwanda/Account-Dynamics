import { NextResponse } from "next/server";
import { parseParams, created, serverError } from "@/lib/api-helpers";
import { internshipInquirySchema, PROGRAM_TYPE_LABELS } from "@/lib/validation";
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

  if (!(await isFormAllowed(request, "internship-inquiry"))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let idemKey = "";

  try {
    const body = await request.json();
    const parsed = parseParams(internshipInquirySchema, body);
    if (!parsed.success) return parsed.error;
    idemKey = parsed.data.idempotencyKey ?? "";

    if (idemKey && !claimIdempotency("internship-inquiry", idemKey)) {
      return NextResponse.json(
        { ok: true, duplicate: true, message: "This application was already received." },
        { status: 200 }
      );
    }

    if (isSpam(parsed.data)) {
      logger.info("Spam internship inquiry rejected", { email: parsed.data.email });
      return created({ ok: true, spam: true });
    }

    const settings = await getSiteSettings();

    const inquiry = await prisma.internshipInquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        country: parsed.data.country ?? null,
        university: parsed.data.university ?? null,
        fieldOfStudy: parsed.data.fieldOfStudy ?? null,
        programType: parsed.data.programType ?? null,
        preferredStartDate: parsed.data.preferredStartDate ?? null,
        duration: parsed.data.duration ?? null,
        experience: parsed.data.experience ?? null,
        areasOfInterest: parsed.data.areasOfInterest ?? null,
        message: parsed.data.message ?? null,
        status: "NEW",
      },
    });

    const programLabel = parsed.data.programType
      ? PROGRAM_TYPE_LABELS[parsed.data.programType as keyof typeof PROGRAM_TYPE_LABELS] ??
        parsed.data.programType
      : "Programme application";

    await notifyAdmins({
      type: "inquiry",
      title: `New ${programLabel.toLowerCase()} application from ${parsed.data.name}`,
      message: [parsed.data.university, parsed.data.fieldOfStudy].filter(Boolean).join(" — ") || programLabel,
      link: `/admin/internship-inquiries`,
    });

    try {
      await notifyAdminOfLead(
        {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          service: programLabel,
          type: "internship",
          createdAt: new Date(),
          message: parsed.data.message,
          extra: {
            Country: parsed.data.country,
            University: parsed.data.university,
            "Field of study": parsed.data.fieldOfStudy,
            Programme: programLabel,
            "Preferred start": parsed.data.preferredStartDate,
            Duration: parsed.data.duration,
            Experience: parsed.data.experience,
            "Areas of interest": parsed.data.areasOfInterest,
          },
        },
        settings.adminEmail
      );
      await sendLeadConfirmation(parsed.data.email, "internship");
    } catch {
      // non-critical
    }

    return created(inquiry);
  } catch (error) {
    if (idemKey) releaseIdempotency("internship-inquiry", idemKey);
    logger.error("Failed to create internship inquiry", { error: String(error) });
    return serverError();
  }
}
