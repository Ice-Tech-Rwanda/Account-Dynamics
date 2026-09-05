"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { validatePassword } from "@/lib/validation";
import {
  consumePasswordResetToken,
  isValidResetTokenShape,
} from "@/lib/password-reset";

export type ResetPasswordState = { error?: string };

export async function resetPasswordAction(
  _prev: ResetPasswordState | undefined,
  formData: FormData
): Promise<ResetPasswordState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!email || !isValidResetTokenShape(token)) {
    return { error: "This password reset link is invalid or has expired. Request a new one." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }
  const pwError = validatePassword(password);
  if (pwError) return { error: pwError };

  const valid = await consumePasswordResetToken(email, token);
  if (!valid) {
    return { error: "This password reset link is invalid or has expired. Request a new one." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "This password reset link is invalid or has expired. Request a new one." };
  }

  const bcrypt = await import("bcryptjs");
  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { email }, data: { password: hashed } }).catch(() => {
    throw new Error("Failed to update password");
  });

  // Invalidate any other outstanding tokens for this account.
  await prisma.verificationToken.deleteMany({ where: { identifier: email } }).catch(() => undefined);

  redirect("/admin/login?reset=1");
}