import { NextRequest } from "next/server";
import { ok, badRequest, serverError } from "@/lib/api-helpers";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!body || !body.event) return badRequest("Missing event");
    // Log analytics event server-side so it can be forwarded or inspected in logs
    logger.info("analytics.event", { event: body.event, meta: body });
    return ok({ received: true });
  } catch (err) {
    logger.error("analytics.event.error", { error: String(err) });
    return serverError();
  }
}
