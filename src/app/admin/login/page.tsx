"use client";

import { Suspense, useState } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AdminAuthShell } from "@/components/admin/AdminAuthShell";
import {
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  ShieldCheck,
  Mail,
  Lock,
} from "lucide-react";
import { siteConfig } from "@/lib/site";
import { loginAction, type LoginState } from "./actions";

function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin/dashboard";

  const [state, formAction, pending] = useActionState<
    LoginState | undefined,
    FormData
  >(loginAction, undefined);

  const sessionExpired = searchParams.get("expired") === "1";
  const resetDone = searchParams.get("reset") === "1";

  return (
    <AdminAuthShell title="Welcome back." description="Sign in to look after your journeys, your guests, and the stories you share.">
      {sessionExpired && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
        >
          Your session expired. Please sign in again to continue.
        </div>
      )}
      {resetDone && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          Your password has been reset. Please sign in with your new
          password.
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {/* Email */}
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

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Password <span className="text-brand">*</span>
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              disabled={pending}
              className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-60"
              aria-pressed={showPassword}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              disabled={pending}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="flex justify-end">
          <Link
            href="/admin/forgot-password"
            className="text-xs font-semibold text-brand hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Error */}
        {state?.error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-red-400" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-strong px-4 py-3 text-sm font-bold text-white shadow-glow-brand transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-brand-strong disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="size-4" />
              Sign In
            </>
          )}
        </button>
      </form>

    </AdminAuthShell>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
