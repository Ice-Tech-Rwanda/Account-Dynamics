import { Prisma } from "@prisma/client";

export type DonationRecord = {
  id: string;
  donorName: string | null;
  donorEmail: string | null;
  amount: number;
  message: string | null;
  anonymous: boolean;
  status: string;
  createdAt: Date | string;
};

export function maskDonor(d: DonationRecord) {
  if (d.anonymous) return { ...d, donorName: null, donorEmail: null };
  return d;
}

export function calculateTotals(items: DonationRecord[]) {
  const total = items.reduce((s, d) => s + (d.status === "completed" ? d.amount : 0), 0);
  const count = items.filter((d) => d.status === "completed").length;
  return { total, count };
}

export function generateCsv(items: (Prisma.DonationGetPayload<{ select: any }> | DonationRecord)[]) {
  const headers = ["id", "donorName", "donorEmail", "amount", "anonymous", "status", "message", "createdAt"];
  const rows = items.map((it) => {
    const d: any = "createdAt" in it ? it : (it as any);
    const donorName = d.anonymous ? "" : d.donorName ?? "";
    const donorEmail = d.anonymous ? "" : d.donorEmail ?? "";
    const amount = d.amount ?? "";
    const message = (d.message ?? "").replace(/\r?\n/g, " ");
    const createdAt = d.createdAt ? new Date(d.createdAt).toISOString() : "";
    return [d.id, donorName, donorEmail, String(amount), String(d.anonymous), d.status ?? "", message, createdAt];
  });

  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  return csv;
}
