import { NextResponse } from "next/server";
import { parseParams, created, ok, serverError } from "@/lib/api-helpers";
import { newsletterSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/services/notifications";
import { sendNewsletterConfirmation, sendEmail } from "@/lib/services/email";
import { getSiteSettings } from "@/lib/content/service.server";
import { logger } from "@/lib/logger";
import { isFormAllowed } from "@/lib/localRateLimiter";
import { validateOrigin } from "@/lib/csrf";

async function sendNewsletterEmails(email: string, action: "subscribed" | "reactivated") {
  try {
    const settings = await getSiteSettings();
    await sendEmail({
      to: settings.adminEmail,
      subject: `New newsletter subscriber — ${email}`,
      text: [
        `A new visitor subscribed to the newsletter:`,
        ``,
        `Email: ${email}`,
        `Status: ${action}`,
        `Date:   ${new Date().toLocaleString()}`,
      ].join("\n"),
    });
    await sendNewsletterConfirmation(email);
  } catch (e) {
    logger.warn("Failed to send newsletter emails", { err: String(e) });
  }
}

export async function POST(request: Request) {
  const csrf = validateOrigin(request);
  if (!csrf.ok) {
    return NextResponse.json({ error: "Request rejected" }, { status: 403 });
  }

  if (!(await isFormAllowed(request, "newsletter"))) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = parseParams(newsletterSchema, body);
    if (!parsed.success) return parsed.error;

    const email = parsed.data.email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.active) {
        // Already subscribed — return success (idempotent)
        return ok({ ok: true, message: "You are already subscribed." });
      }
      // Reactivate
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { active: true },
      });
      await sendNewsletterEmails(email, "reactivated");
      return ok({ ok: true, message: "Welcome back! Your subscription has been reactivated." });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email, active: true },
    });

    await notifyAdmins({
      type: "subscriber",
      title: `New newsletter subscriber`,
      message: email,
    });

    await sendNewsletterEmails(email, "subscribed");

    return created({ ok: true, subscriber: { id: subscriber.id, email: subscriber.email } });
  } catch (error) {
    logger.error("Failed to subscribe to newsletter", { error: String(error) });
    return serverError();
  }
}
