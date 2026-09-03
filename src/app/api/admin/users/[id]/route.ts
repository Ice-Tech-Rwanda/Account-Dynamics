import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin/api-registry";
import { userUpdateSchema } from "@/lib/validation";
import { logAudit } from "@/lib/audit";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, active: true, phone: true, bio: true, lastLoginAt: true, createdAt: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole("SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const parsed = userUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
  }

  // Prevent self-deactivation
  if (id === session.user.id && parsed.data.active === false) {
    return NextResponse.json({ error: "Cannot deactivate your own account" }, { status: 400 });
  }

  // Prevent self-demotion
  if (id === session.user.id && parsed.data.role && parsed.data.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
  }

  // Protect last SUPER_ADMIN: prevent demoting or deactivating the last one
  const affectsActiveSuperAdmin =
    (parsed.data.role !== undefined && parsed.data.role !== "SUPER_ADMIN") ||
    parsed.data.active === false;
  if (affectsActiveSuperAdmin) {
    const targetUser = await prisma.user.findUnique({ where: { id }, select: { role: true, active: true } });
    if (targetUser?.role === "SUPER_ADMIN" && targetUser.active) {
      const superAdminCount = await prisma.user.count({ where: { role: "SUPER_ADMIN", active: true } });
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: "Cannot deactivate or demote the last SUPER_ADMIN" }, { status: 400 });
      }
    }
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    });

    await logAudit({ userId: session.user.id, action: "user:update", entity: "User", entityId: id, details: JSON.stringify(Object.keys(parsed.data)) });

    return NextResponse.json(user);
  } catch (error: any) {
    if (error?.code === "P2025") return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (error?.code === "P2002") return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    console.error("[admin:users] update error", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole("SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  if (id === session.user.id) return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });

  // Protect last SUPER_ADMIN from deletion
  const targetUser = await prisma.user.findUnique({ where: { id }, select: { role: true, active: true } });
  if (targetUser?.role === "SUPER_ADMIN" && targetUser.active) {
    const superAdminCount = await prisma.user.count({ where: { role: "SUPER_ADMIN", active: true } });
    if (superAdminCount <= 1) {
      return NextResponse.json({ error: "Cannot delete the last SUPER_ADMIN" }, { status: 400 });
    }
  }

  try {
    await prisma.user.delete({ where: { id } });
    await logAudit({ userId: session.user.id, action: "user:delete", entity: "User", entityId: id });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[admin:users] delete error", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
