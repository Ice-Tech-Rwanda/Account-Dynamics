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
    const q = searchParams.get("q")?.trim();
    const mimeType = searchParams.get("mimeType")?.trim();
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { alt: { contains: q, mode: "insensitive" } },
      ];
    }
    if (mimeType) where.mimeType = { contains: mimeType };

    const [data, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { uploader: { select: { id: true, name: true } } },
      }),
      prisma.media.count({ where }),
    ]);

    return NextResponse.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[admin:media] list error", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
