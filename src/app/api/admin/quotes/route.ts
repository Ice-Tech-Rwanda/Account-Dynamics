import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const status = searchParams.get("status") || undefined;
    const read = searchParams.get("read");
    const archived = searchParams.get("archived");
    const q = searchParams.get("q")?.trim();
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (status) where.status = status;
    if (read === "true") where.read = true;
    if (read === "false") where.read = false;
    if (archived === "true") where.archived = true;
    if (archived === "false" || !archived) where.archived = false;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
        { service: { contains: q, mode: "insensitive" } },
      ];
    }

    const [data, total, unreadCount] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { assignedTo: { select: { id: true, name: true, email: true } } },
      }),
      prisma.quoteRequest.count({ where }),
      prisma.quoteRequest.count({ where: { read: false, archived: false } }),
    ]);

    return NextResponse.json({
      data,
      unreadCount,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[admin:quotes] list error", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}
