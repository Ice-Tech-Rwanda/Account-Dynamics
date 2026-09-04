import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin/api-registry";
import { logAudit } from "@/lib/audit";
import { sendInquiryStatusUpdate } from "@/lib/services/email";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("EDITOR");
  if (error) return error;

  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { assignedTo: { select: { id: true, name: true, email: true } } },
  });
  if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(inquiry);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole("EDITOR");
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const allowed = ["status", "read", "archived", "assignedToId"];
  const data: Record<string, any> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
  }

  // Validate assignedToId references a real active user
  if (data.assignedToId !== undefined) {
    if (data.assignedToId === null) {
      // Allow unassigning
    } else if (typeof data.assignedToId === "string") {
      const assignee = await prisma.user.findUnique({
        where: { id: data.assignedToId },
        select: { id: true, active: true },
      });
      if (!assignee || !assignee.active) {
        return NextResponse.json({ error: "Assigned user not found or inactive" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid assignedToId" }, { status: 400 });
    }
  }

  // Validate status enum
  const validStatuses = ["NEW", "CONTACTED", "IN_PROGRESS", "QUALIFIED", "CONVERTED", "CLOSED", "SPAM"];
  if (data.status && !validStatuses.includes(data.status)) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  }

  try {
    const old = await prisma.inquiry.findUnique({
      where: { id },
      select: { status: true, email: true, name: true, service: true },
    });

    const inquiry = await prisma.inquiry.update({ where: { id }, data });
    await logAudit({ userId: session.user.id, action: "inquiry:update", entity: "Inquiry", entityId: id, details: JSON.stringify(Object.keys(data)) });

    if (old && data.status && data.status !== old.status && old.email) {
      sendInquiryStatusUpdate(
        { email: old.email, name: old.name, service: old.service },
        data.status,
      ).catch((err) => console.error("[inquiry] status email failed", err));
    }

    return NextResponse.json(inquiry);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole("SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  try {
    await prisma.inquiry.delete({ where: { id } });
    await logAudit({ userId: session.user.id, action: "inquiry:delete", entity: "Inquiry", entityId: id });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[admin:inquiries] delete error", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
