import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin/api-registry";
import { logAudit } from "@/lib/audit";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("EDITOR");
  if (error) return error;

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
  const { session, error } = await requireRole("EDITOR");
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const allowed = ["status", "read", "archived", "assignedToId"];
  const data: Record<string, any> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  // Validate assignedToId
  if (data.assignedToId !== undefined && data.assignedToId !== null) {
    if (typeof data.assignedToId === "string") {
      const assignee = await prisma.user.findUnique({ where: { id: data.assignedToId }, select: { id: true, active: true } });
      if (!assignee || !assignee.active) {
        return NextResponse.json({ error: "Assigned user not found or inactive" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid assignedToId" }, { status: 400 });
    }
  }

  // Validate status enum
  const validStatuses = ["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED", "SPAM"];
  if (data.status && !validStatuses.includes(data.status)) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
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
  const { session, error } = await requireRole("SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  try {
    await prisma.consultationRequest.delete({ where: { id } });
    await logAudit({ userId: session.user.id, action: "consultation:delete", entity: "ConsultationRequest", entityId: id });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
