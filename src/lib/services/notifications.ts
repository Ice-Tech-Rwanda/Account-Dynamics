import "server-only";

import { prisma } from "@/lib/prisma";

export type NotificationInput = {
  type: "inquiry" | "quote" | "consultation" | "subscriber" | "system";
  title: string;
  message?: string | null;
  link?: string | null;
};

/** Creates a broadcast notification visible to all administrators. */
export async function notifyAdmins(input: NotificationInput) {
  try {
    await prisma.notification.create({
      data: {
        type: input.type,
        title: input.title,
        message: input.message ?? null,
        link: input.link ?? null,
        read: false,
      },
    });
  } catch (error) {
    console.error("[notifications] failed to create notification", error);
  }
}

export async function getUnreadNotificationCount() {
  try {
    return await prisma.notification.count({ where: { read: false } });
  } catch {
    return 0;
  }
}

export async function listNotifications(limit = 10) {
  try {
    return await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function markAllNotificationsRead() {
  try {
    await prisma.notification.updateMany({ data: { read: true } });
    return true;
  } catch {
    return false;
  }
}

export async function markNotificationRead(id: string) {
  try {
    await prisma.notification.update({ where: { id }, data: { read: true } });
    return true;
  } catch {
    return false;
  }
}