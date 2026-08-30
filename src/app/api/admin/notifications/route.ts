import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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
