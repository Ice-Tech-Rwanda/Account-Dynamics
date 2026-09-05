"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validatePassword } from "@/lib/validation";
import { logAudit } from "@/lib/audit";

export type ChangePasswordState = { success?: boolean; error?: string };

export async function changePasswordAction(
  _prev: ChangePasswordState | undefined,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (next !== confirm) return { error: "New passwords do not match." };
  const pwError = validatePassword(next);
  if (pwError) return { error: pwError };
  if (current === next) return { error: "New password must be different from your current password." };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.password) return { error: "Account not found." };

  const bcrypt = await import("bcryptjs");
  const valid = await bcrypt.compare(current, user.password);
  if (!valid) return { error: "Your current password is incorrect." };

  const hashed = await bcrypt.hash(next, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  await logAudit({
    userId: user.id,
    action: "profile:password-change",
    entity: "User",
    entityId: user.id,
    details: "Password changed",
  });

  return { success: true };
}