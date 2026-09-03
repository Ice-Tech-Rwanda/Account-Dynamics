import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin/api-registry";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { error } = await requireRole("EDITOR");
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const q = searchParams.get("q")?.trim();
    const skip = (page - 1) * limit;

    const where = q ? { email: { contains: q, mode: "insensitive" as const } } : {};

    const [data, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return NextResponse.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[admin:subscribers] list error", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  try {
    if (id) {
      await prisma.newsletterSubscriber.delete({ where: { id } });
      return new NextResponse(null, { status: 204 });
    }
    if (email) {
      const result = await prisma.newsletterSubscriber.deleteMany({ where: { email } });
      if (result.count === 0) return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
      return new NextResponse(null, { status: 204 });
    }
  } catch (error: any) {
    if (error?.code === "P2025") return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    console.error("[admin:subscribers] delete error", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }

  return NextResponse.json({ error: "Provide id or email" }, { status: 400 });
}
