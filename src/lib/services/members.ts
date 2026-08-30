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

export function generateMembersCsv(items: MemberRecord[]) {
  const headers = ["id", "name", "email", "phone", "category", "status", "createdAt"];
  const rows = items.map((m) => {
    return [m.id, m.name, m.email ?? "", m.phone ?? "", m.category ?? "", m.status ?? "", m.createdAt ? new Date(m.createdAt).toISOString() : ""];
  });
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  return csv;
}
