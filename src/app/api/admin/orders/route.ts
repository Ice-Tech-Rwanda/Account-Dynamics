import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError, unauthorized } from "@/lib/api-helpers";
import { auth } from "@/lib/auth";
import { parsePagination } from "@/lib/validation";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const { searchParams } = request.nextUrl;
    const { page, limit } = parsePagination(searchParams);
    const skip = (page - 1) * limit;

    const where: any = {};
    const status = searchParams.get("status");
    const q = searchParams.get("q");
    if (status) where.status = status;
    if (q) where.OR = [{ customerName: { contains: q } }, { customerEmail: { contains: q } }, { id: { contains: q } }];

    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.order.count({ where }),
    ]);

    return ok({ data: orders, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    logger.error("admin orders list failed", { err: String(err) });
    return serverError();
  }
}
