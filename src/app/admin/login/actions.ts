"use server";

import { signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export type LoginState = { error?: string };

/** Only allow internal redirect paths — prevent open redirects */
function sanitizeRedirect(url: string | null): string {
  if (!url) return "/admin/dashboard";
  // Only allow paths that start with / and don't contain protocol
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes(":")) {
    return url;
  }
  return "/admin/dashboard";
}

export async function loginAction(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = sanitizeRedirect(
    String(formData.get("redirectTo") ?? "")
  );

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid email or password" };
    }
  } catch {
    return { error: "Invalid email or password" };
  }

  redirect(redirectTo);
}

export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
