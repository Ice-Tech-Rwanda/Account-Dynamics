import { NextResponse } from "next/server";
import { parseParams, serverError } from "@/lib/api-helpers";
import { bookingSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/services/notifications";
import { notifyAdminOfLead, sendBookingConfirmation, sendLeadConfirmation } from "@/lib/services/email";
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

  if (!(await isFormAllowed(request, "booking"))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let idemKey = "";

  try {
    const body = await request.json();
    const parsed = parseParams(bookingSchema, body);
    if (!parsed.success) return parsed.error;
    idemKey = parsed.data.idempotencyKey ?? "";

    // Idempotency: a second submission with the same key is a duplicate.
    if (idemKey && !claimIdempotency("booking", idemKey)) {
      return NextResponse.json(
        { ok: true, duplicate: true, message: "This booking was already received." },
        { status: 200 }
      );
    }

    const settings = await getSiteSettings();

    const consultation = await prisma.consultationRequest.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        service: parsed.data.service ?? null,
        preferredDate: parsed.data.date ?? null,
        preferredTime: parsed.data.time ?? null,
        message: parsed.data.notes ?? null,
        status: "NEW",
      },
    });

    await notifyAdmins({
      type: "consultation",
      title: `New consultation request from ${parsed.data.name}`,
      message: parsed.data.service ?? "General",
      link: `/admin/consultations/${consultation.id}`,
    });

    try {
      const data = {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        company: null,
        service: parsed.data.service,
        type: "consultation" as const,
        createdAt: new Date(),
        message: parsed.data.notes,
      };
      await notifyAdminOfLead(data, settings.adminEmail);
      if (parsed.data.date && parsed.data.time) {
        await sendBookingConfirmation({
          email: parsed.data.email,
          name: parsed.data.name,
          service: parsed.data.service,
          date: parsed.data.date,
          time: parsed.data.time,
        });
      } else {
        await sendLeadConfirmation(parsed.data.email, "consultation", parsed.data.phone);
      }
    } catch {
      // non-critical
    }

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    // A failed request releases the claim so a genuine retry can proceed.
    if (idemKey) releaseIdempotency("booking", idemKey);
    logger.error("Failed to create booking", { error: String(error) });
    return serverError();
  }
}
