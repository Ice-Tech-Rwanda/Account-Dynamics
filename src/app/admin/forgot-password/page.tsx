"use client";

import { useActionState } from "react";
import { AdminAuthShell } from "@/components/admin/AdminAuthShell";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { forgotPasswordAction, type ForgotPasswordState } from "./actions";

function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<
    ForgotPasswordState | undefined,
    FormData
  >(forgotPasswordAction, undefined);

  return (
    <AdminAuthShell title="A fresh start." description="Enter your account email and we’ll send you a secure password reset link.">
      {state?.submitted ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          If an account exists for that email, a password reset link has
          been sent. Check your inbox (and spam folder) — the link expires
          in 30 minutes.
        </div>
      ) : (
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              <span>{state.error}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email Address <span className="text-brand">*</span>
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={siteConfig.email}
                disabled={pending}
                className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-strong px-4 py-3 text-sm font-bold text-white shadow-glow-brand transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-brand-strong disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              <>
                <Lock className="size-4" />
                Send Reset Link
              </>
            )}
          </button>

          <Link
            href="/admin/login"
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to Sign In
          </Link>
        </form>
      )}

    </AdminAuthShell>
  );
}

export default function AdminForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
