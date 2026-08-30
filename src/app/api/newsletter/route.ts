import { NextResponse } from "next/server";
import { parseParams, created, ok, serverError } from "@/lib/api-helpers";
import { newsletterSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { notifyAdmins } from "@/lib/services/notifications";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
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

    return created({ ok: true, subscriber: { id: subscriber.id, email: subscriber.email } });
  } catch (error) {
    logger.error("Failed to subscribe to newsletter", { error: String(error) });
    return serverError();
  }
}
