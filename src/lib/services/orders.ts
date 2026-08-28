import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

export async function changeOrderStatus(orderId: string, newStatus: string, userId?: string, idempotencyKey?: string) {
  try {
    if (idempotencyKey) {
      const existing = await prisma.auditLog.findFirst({ where: { entity: "Order", details: { contains: `idempotency:${idempotencyKey}` } } });
      if (existing) return { ok: true, idempotent: true };
    }

    const order = await prisma.order.update({ where: { id: orderId }, data: { status: newStatus } as any });

    const details = `status:${newStatus}${idempotencyKey ? `;idempotency:${idempotencyKey}` : ""}`;
    await prisma.auditLog.create({ data: { userId: userId ?? undefined, action: "order:status", entity: "Order", entityId: orderId, details } });

    return { ok: true, order };
  } catch (err) {
    logger.error("changeOrderStatus failed", { err: String(err), orderId, newStatus });
    throw err;
  }
}

export function generateOrdersCsv(orders: any[]) {
  const headers = ["id", "customerName", "customerEmail", "total", "status", "createdAt"];
  const rows = orders.map((o) => [o.id, o.customerName ?? "", o.customerEmail ?? "", String(o.total ?? ""), o.status ?? "", o.createdAt ? new Date(o.createdAt).toISOString() : ""]);
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  return csv;
}
