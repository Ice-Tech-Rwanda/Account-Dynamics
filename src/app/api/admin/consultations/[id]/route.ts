import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const consultation = await prisma.consultationRequest.findUnique({
    where: { id },
    include: { assignedTo: { select: { id: true, name: true, email: true } } },
  });
  if (!consultation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!consultation.read) {
    await prisma.consultationRequest.update({ where: { id }, data: { read: true } });
  }

  return NextResponse.json(consultation);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const allowed = ["status", "read", "archived", "assignedToId"];
  const data: Record<string, any> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  try {
    const consultation = await prisma.consultationRequest.update({ where: { id }, data });
    await logAudit({ userId: session.user.id, action: "consultation:update", entity: "ConsultationRequest", entityId: id, details: JSON.stringify(Object.keys(data)) });
    return NextResponse.json(consultation);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) !== "SUPER_ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  try {
    await prisma.consultationRequest.delete({ where: { id } });
    await logAudit({ userId: session.user.id, action: "consultation:delete", entity: "ConsultationRequest", entityId: id });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
