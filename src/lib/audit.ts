import { prisma } from "@/lib/prisma";

export async function logAudit({ userId, action, entity, entityId, details }: { userId?: string; action: string; entity?: string; entityId?: string; details?: string }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        entity: entity ?? "",
        entityId: entityId ?? null,
        details: details ?? null,
      },
    });
  } catch (e) {
    // Don't crash the main flow if audit logging fails.
    console.error("Failed to write audit log", e);
  }
}
