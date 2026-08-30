import { NextResponse } from "next/server";
import { parseParams, serverError } from "@/lib/api-helpers";
import { bookingSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/services/notifications";
import { notifyAdminOfLead, sendLeadConfirmation } from "@/lib/services/email";
import { getSiteSettings } from "@/lib/content/service.server";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseParams(bookingSchema, body);
    if (!parsed.success) return parsed.error;

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
      await sendLeadConfirmation(parsed.data.email, "consultation", parsed.data.phone);
    } catch {
      // non-critical
    }

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    logger.error("Failed to create booking", { error: String(error) });
    return serverError();
  }
}
