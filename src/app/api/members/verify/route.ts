import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/services/verification";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-helpers";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const identifier = searchParams.get("identifier") || "";
    const token = searchParams.get("token") || "";
    if (!identifier || !token) return serverError();

    const valid = await verifyToken(identifier, token);
    if (!valid) return serverError();

    // Optionally, mark member as verified. Member model has no emailVerified field,
    // so we set status to 'active' if currently 'pending' or leave unchanged.
    await prisma.member.updateMany({ where: { email: identifier }, data: { status: "active" } as any });

    return ok({ success: true });
  } catch (err) {
    logger.error("verification failed", { err: String(err) });
    return serverError();
  }
}
