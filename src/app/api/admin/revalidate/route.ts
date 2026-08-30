import { NextResponse } from "next/server";
import { requireAdmin, ok, serverError } from "@/lib/api-helpers";
import { revalidateSite } from "@/lib/revalidate";
import { logger } from "@/lib/logger";

export async function POST() {
  try {
    const session = await requireAdmin();
    if (session instanceof NextResponse) return session;

    revalidateSite();

    logger.info("Site revalidated", { userId: session.user.id });
    return ok({ ok: true, message: "All caches invalidated." });
  } catch (error) {
    logger.error("Failed to revalidate site", { error: String(error) });
    return serverError();
  }
}
