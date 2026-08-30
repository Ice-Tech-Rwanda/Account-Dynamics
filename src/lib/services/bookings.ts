import { logger } from "@/lib/logger";

export async function createBooking(data: { email: string; service?: string | null; name?: string }, actorId?: string) {
  // Booking creation is now handled directly in the API route.
  // This stub exists for any remaining call sites.
  logger.info("createBooking called (stub)", { email: data.email, service: data.service });
  return { ok: true, stub: true };
}
