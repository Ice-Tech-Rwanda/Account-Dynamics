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

export async function PATCH(request: Request) {
  const { error } = await requireRole("EDITOR");
  if (error) return error;

  const body = await request.json();
  const { markAllRead, id } = body;

  try {
    if (markAllRead) {
      await prisma.notification.updateMany({ data: { read: true } });
      return NextResponse.json({ ok: true });
    }

    if (id) {
      const result = await prisma.notification.update({ where: { id }, data: { read: true } });
      if (!result) return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }
  } catch (error: any) {
    if (error?.code === "P2025") return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    console.error("[admin:notifications] update error", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }

  return NextResponse.json({ error: "Provide markAllRead or id" }, { status: 400 });
}

export async function DELETE(request: Request) {
  const { error } = await requireRole("EDITOR");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const clearAll = searchParams.get("clearAll") === "true";

  try {
    if (clearAll) {
      await prisma.notification.deleteMany({});
      return new NextResponse(null, { status: 204 });
    }
    if (id) {
      await prisma.notification.delete({ where: { id } });
      return new NextResponse(null, { status: 204 });
    }
  } catch (error: any) {
    if (error?.code === "P2025") return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    console.error("[admin:notifications] delete error", error);
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
  }

  return NextResponse.json({ error: "Provide id or clearAll" }, { status: 400 });
}
