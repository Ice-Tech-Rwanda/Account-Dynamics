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

  redirect("/admin/dashboard");
}

export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
