import { NextResponse } from "next/server";
import { parseParams, ok, serverError } from "@/lib/api-helpers";
import { newsletterSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { isFormAllowed } from "@/lib/localRateLimiter";
import { validateOrigin } from "@/lib/csrf";

/**
 * Public unsubscribe endpoint for the newsletter.
 * Marks the subscriber inactive (the row is kept for admin stats). The
 * response is always a success so the endpoint cannot be used to enumerate
 * which emails are subscribed; re-sending is harmless (idempotent).
 */
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

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing && existing.active) {
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { active: false },
      });
      logger.info("Newsletter subscriber unsubscribed", { email });
    }

    return ok({ ok: true, message: "You have been unsubscribed from the newsletter." });
  } catch (error) {
    logger.error("Failed to unsubscribe from newsletter", { error: String(error) });
    return serverError();
  }
}