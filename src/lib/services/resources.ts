import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

const MAX_SIZE_BYTES = Number(process.env.RESOURCE_MAX_UPLOAD_BYTES ?? 5 * 1024 * 1024);
const ALLOWED_EXT = ["pdf", "docx", "pptx", "xlsx", "txt", "md", "jpg", "jpeg", "png"];

export function validateUploadMeta(filename: string, size: number, _mime?: string) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_EXT.includes(ext)) return { ok: false, error: 'invalid_extension' };
  if (size > MAX_SIZE_BYTES) return { ok: false, error: 'file_too_large' };
  // basic mime checks can be added
  return { ok: true };
}

export async function createResourceVersion(resourceId: string, fileUrl: string, title?: string, notes?: string, userId?: string) {
  try {
    const ver = await prisma.resourceVersion.create({ data: { resourceId, fileUrl, title, notes } as any });
    await prisma.resource.update({ where: { id: resourceId }, data: { currentVersionId: ver.id, fileUrl } as any });
    await prisma.auditLog.create({ data: { userId: userId ?? undefined, action: 'resource:version', entity: 'Resource', entityId: resourceId, details: `version:${ver.id}` } });
    return { ok: true, version: ver };
  } catch (err) {
    logger.error('createResourceVersion failed', { err: String(err), resourceId, fileUrl });
    throw err;
  }
}

export async function publishResource(resourceId: string, userId?: string) {
  try {
    const res = await prisma.resource.update({ where: { id: resourceId }, data: { status: 'published' } as any });
    await prisma.auditLog.create({ data: { userId: userId ?? undefined, action: 'resource:publish', entity: 'Resource', entityId: resourceId } });
    return { ok: true, resource: res };
  } catch (err) {
    logger.error('publishResource failed', { err: String(err), resourceId });
    throw err;
  }
}

export async function unpublishResource(resourceId: string, userId?: string) {
  try {
    const res = await prisma.resource.update({ where: { id: resourceId }, data: { status: 'draft' } as any });
    await prisma.auditLog.create({ data: { userId: userId ?? undefined, action: 'resource:unpublish', entity: 'Resource', entityId: resourceId } });
    return { ok: true, resource: res };
  } catch (err) {
    logger.error('unpublishResource failed', { err: String(err), resourceId });
    throw err;
  }
}

export async function paginateResources(page = 1, perPage = 20, q?: string) {
  const skip = (page - 1) * perPage;
  const where: any = {};
  if (q) where.OR = [{ title: { contains: q } }, { description: { contains: q } }];
  const [items, total] = await Promise.all([
    prisma.resource.findMany({ where, orderBy: { updatedAt: 'desc' }, skip, take: perPage }),
    prisma.resource.count({ where }),
  ]);
  return { items, total, page, perPage };
}

export function generateResourcesCsv(rows: any[]) {
  const headers = ['id', 'title', 'slug', 'status', 'fileUrl', 'createdAt', 'updatedAt'];
  const csvRows = rows.map((r) => [r.id, r.title, r.slug ?? '', r.status, r.fileUrl ?? '', r.createdAt ? new Date(r.createdAt).toISOString() : '', r.updatedAt ? new Date(r.updatedAt).toISOString() : '']);
  const csv = [headers.join(','), ...csvRows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
  return csv;
}

export async function previewAccessibility(_fileUrl: string) {
  // Placeholder: integrate axe-core or external accessibility API in production
  // Return a basic structure indicating no issues.
  return { ok: true, issues: [] };
}
