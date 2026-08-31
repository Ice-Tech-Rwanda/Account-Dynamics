import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin/api-registry";

export async function GET() {
  const { error } = await requireRole("EDITOR");
  if (error) return error;

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.notification.count({ where: { read: false } }),
  ]);

  return NextResponse.json({ data: notifications, unreadCount });
}

export async function PUT(request: Request) {
  const { error } = await requireRole("EDITOR");
  if (error) return error;

  const body = await request.json();
  const { markAllRead, id } = body;

  if (markAllRead) {
    await prisma.notification.updateMany({ data: { read: true } });
    return NextResponse.json({ ok: true });
  }

  if (id) {
    await prisma.notification.update({ where: { id }, data: { read: true } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Provide markAllRead or id" }, { status: 400 });
}
