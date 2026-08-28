import { Prisma } from "@prisma/client";

export type MemberRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  category?: string;
  status?: string;
  role?: string | null;
  createdAt?: Date | string;
};

export function maskMemberPII(m: MemberRecord, hideEmail = false) {
  return {
    ...m,
    email: hideEmail || m.status === "inactive" ? null : m.email,
    phone: m.status === "inactive" ? null : m.phone,
  };
}

export function generateMembersCsv(items: (Prisma.MemberGetPayload<any> | MemberRecord)[]) {
  const headers = ["id", "name", "email", "phone", "category", "status", "createdAt"];
  const rows = items.map((it) => {
    const m: any = it;
    return [m.id, m.name, m.email ?? "", m.phone ?? "", m.category ?? "", m.status ?? "", m.createdAt ? new Date(m.createdAt).toISOString() : ""];
  });
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  return csv;
}
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function createMember(data: any, actorId?: string) {
  const member = await prisma.member.create({ data });
  await logAudit({ userId: actorId, action: "create_member", entity: "Member", entityId: member.id, details: JSON.stringify({ data }) });
  return member;
}

export async function updateMember(id: string, data: any, actorId?: string) {
  const member = await prisma.member.update({ where: { id }, data });
  await logAudit({ userId: actorId, action: "update_member", entity: "Member", entityId: id, details: JSON.stringify({ data }) });
  return member;
}

export async function deleteMember(id: string, actorId?: string) {
  const member = await prisma.member.delete({ where: { id } });
  await logAudit({ userId: actorId, action: "delete_member", entity: "Member", entityId: id });
  return member;
}
