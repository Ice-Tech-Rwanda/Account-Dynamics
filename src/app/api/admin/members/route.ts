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

    const [members, total] = await Promise.all([
      prisma.member.findMany({ orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.member.count(),
    ]);

    return ok({ data: members, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    logger.error("admin members list failed", { err: String(err) });
    return serverError();
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const body = await request.json();
    const { ids, action, role } = body as any;
    if (!Array.isArray(ids) || !action) return serverError();

    if (action === "delete") {
      await prisma.member.deleteMany({ where: { id: { in: ids } } });
      return ok({ success: true });
    }

    if (action === "setRole" && role) {
      await Promise.all(ids.map((id: string) => prisma.user.updateMany({ where: { id }, data: { role } as any })));
      return ok({ success: true });
    }

    return serverError();
  } catch (err) {
    logger.error("admin members bulk action failed", { err: String(err) });
    return serverError();
  }
}
