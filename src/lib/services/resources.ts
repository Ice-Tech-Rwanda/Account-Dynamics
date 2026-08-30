const MAX_SIZE_BYTES = Number(process.env.RESOURCE_MAX_UPLOAD_BYTES ?? 5 * 1024 * 1024);
const ALLOWED_EXT = ["pdf", "docx", "pptx", "xlsx", "txt", "md", "jpg", "jpeg", "png"];

export function validateUploadMeta(filename: string, size: number, _mime?: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.includes(ext)) return { ok: false, error: "invalid_extension" };
  if (size > MAX_SIZE_BYTES) return { ok: false, error: "file_too_large" };
  return { ok: true };
}

export function generateResourcesCsv(rows: any[]) {
  const headers = ["id", "title", "slug", "status", "fileUrl", "createdAt", "updatedAt"];
  const csvRows = rows.map((r) => [r.id, r.title, r.slug ?? "", r.status, r.fileUrl ?? "", r.createdAt ? new Date(r.createdAt).toISOString() : "", r.updatedAt ? new Date(r.updatedAt).toISOString() : ""]);
  const csv = [headers.join(","), ...csvRows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  return csv;
}
