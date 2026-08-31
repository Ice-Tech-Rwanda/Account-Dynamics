"use server";

import { signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin/dashboard",
    });
  } catch (err) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      redirect("/admin/dashboard");
    }
    return { error: "Invalid email or password" };
  }

  redirect("/admin/dashboard");
}

export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
