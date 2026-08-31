import { NextResponse } from "next/server";
import { parseParams, created, serverError } from "@/lib/api-helpers";
import { contactSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/services/notifications";
import { notifyAdminOfLead, sendLeadConfirmation } from "@/lib/services/email";
import { getSiteSettings } from "@/lib/content/service.server";
import { logger } from "@/lib/logger";
import { isFormAllowed } from "@/lib/localRateLimiter";
import { validateOrigin } from "@/lib/csrf";

export async function POST(request: Request) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) {
    return NextResponse.json({ error: "Request rejected" }, { status: 403 });
  }

  if (!(await isFormAllowed(request, "contact"))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = parseParams(contactSchema, body);
    if (!parsed.success) return parsed.error;

    const settings = await getSiteSettings();

    const inquiry = await prisma.inquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        status: "NEW",
        source: "contact",
      },
    });

    await notifyAdmins({
      type: "inquiry",
      title: `New inquiry from ${parsed.data.name}`,
      message: parsed.data.subject,
      link: `/admin/inquiries/${inquiry.id}`,
    });

    try {
      const data = {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: null,
        company: null,
        service: null,
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
    logger.error("Failed to send contact message", { error: String(error) });
    return serverError();
  }
}
