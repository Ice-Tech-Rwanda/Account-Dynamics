"use server";

import { emailSchema } from "@/lib/validation";
import { createPasswordResetToken } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/services/email";
import { siteConfig } from "@/lib/site";

export type ForgotPasswordState = { submitted: boolean; error?: string };

export async function forgotPasswordAction(
  _prev: ForgotPasswordState | undefined,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { submitted: false, error: "Please enter a valid email address." };
  }

  try {
    // Returns null for unknown accounts AND for rate-limited requests — we
    // respond identically either way so the form never reveals which emails
    // hold admin accounts.
    const token = await createPasswordResetToken(email);
    if (token === null) return { submitted: true };

    const resetUrl = new URL("/admin/reset-password", siteConfig.siteUrl);
    resetUrl.searchParams.set("email", email);
    resetUrl.searchParams.set("token", token);

    await sendPasswordResetEmail(email, resetUrl.toString());
    return { submitted: true };
  } catch (err) {
    console.error("[password-reset] forgotPasswordAction error", err);
    return {
      submitted: false,
      error: "Something went wrong sending the reset email. Please try again later.",
    };
  }
}