import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, serverError, unauthorized } from "@/lib/api-helpers";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const body = await request.json().catch(() => ({}));
    const { ids, action } = body as { ids?: string[]; action?: string };
    if (!Array.isArray(ids) || ids.length === 0 || !action) return serverError();

    if (action === "approve") {
      // Mark approved by setting 'order' to current timestamp to surface it.
      await prisma.galleryItem.updateMany({ where: { id: { in: ids } }, data: { order: Math.floor(Date.now() / 1000) } as any });
      // record in audit log
      await prisma.auditLog.createMany({ data: ids.map((id) => ({ userId: session.user?.id ?? undefined, action: "approve", entity: "GalleryItem", entityId: id, details: "approved via moderation" })) });
      return ok({ success: true });
    }

    if (action === "reject") {
      // Delete rejected items; moderation policy may prefer soft-delete.
      await prisma.galleryItem.deleteMany({ where: { id: { in: ids } } });
      await prisma.auditLog.createMany({ data: ids.map((id) => ({ userId: session.user?.id ?? undefined, action: "reject", entity: "GalleryItem", entityId: id, details: "rejected and deleted via moderation" })) });
      return ok({ success: true });
    }

    if (action === "flag") {
      await prisma.auditLog.createMany({ data: ids.map((id) => ({ userId: session.user?.id ?? undefined, action: "flag", entity: "GalleryItem", entityId: id, details: "flagged for review" })) });
      return ok({ success: true });
    }

    return serverError();
  } catch (err) {
    logger.error("moderation action failed", { err: String(err) });
    return serverError();
  }
}
