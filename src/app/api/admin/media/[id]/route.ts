import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const media = await prisma.media.findUnique({
    where: { id },
    include: { uploader: { select: { id: true, name: true } } },
  });
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(media);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) !== "SUPER_ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  try {
    await prisma.media.delete({ where: { id } });
    await logAudit({ userId: session.user.id, action: "media:delete", entity: "Media", entityId: id });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
