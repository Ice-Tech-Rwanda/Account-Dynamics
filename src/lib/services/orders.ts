export function generateOrdersCsv(orders: any[]) {
  const headers = ["id", "customerName", "customerEmail", "total", "status", "createdAt"];
  const rows = orders.map((o) => [o.id, o.customerName ?? "", o.customerEmail ?? "", String(o.total ?? ""), o.status ?? "", o.createdAt ? new Date(o.createdAt).toISOString() : ""]);
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  return csv;
}
