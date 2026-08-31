"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Eye, EyeOff, LogIn, Loader2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/lib/site";
import { loginAction, type LoginState } from "./actions";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, pending] = useActionState<
    LoginState | undefined,
    FormData
  >(loginAction, undefined);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-brand-bg-dark to-slate-950 p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-6 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 top-1/3 h-56 w-56 rounded-full bg-brand/10 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur">
            <Logo size="md" showWordmark={false} />
          </div>
          <h1 className="mt-4 text-2xl font-black text-white tracking-tight">
            {siteConfig.productName}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to your admin dashboard
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <form action={formAction} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={siteConfig.email}
                disabled={pending}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-white placeholder:text-slate-500 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/30 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  disabled={pending}
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/30 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white disabled:opacity-60"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

            {state?.error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-strong px-4 py-3 font-semibold text-white shadow-lg shadow-brand/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
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

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="size-3.5" />
            Secure admin access for {siteConfig.productName}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} {siteConfig.productName}. All rights
          reserved.
        </p>
      </div>
    </main>
  );
}
