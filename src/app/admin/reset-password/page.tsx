"use client";

import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/lib/site";
import { resetPasswordAction, type ResetPasswordState } from "./actions";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const validLink = Boolean(email && token && /^[a-f0-9]{64}$/i.test(token));

  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, pending] = useActionState<
    ResetPasswordState | undefined,
    FormData
  >(resetPasswordAction, undefined);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-brand-bg-dark to-slate-950 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(14,124,123,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(2,69,236,0.12),transparent_50%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent border border-accent/20">
              Admin Access
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-white"
          >
            Choose a New Password
          </motion.h1>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      <section className="relative -mt-8 pb-20 sm:pb-28">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-card"
          >
            <div className="mb-6 flex flex-col items-center">
              <div className="rounded-2xl bg-brand/5 p-3 ring-1 ring-brand/10">
                <Logo size="md" showWordmark={false} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900 tracking-tight">
                Set New Password
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {validLink ? `For ${email}` : "Your reset link"}
              </p>
            </div>

            {!validLink ? (
              <div className="text-center">
                <div
                  role="alert"
                  className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
                >
                  This password reset link is invalid or has expired. Request a
                  new one to continue.
                </div>
                <Link
                  href="/admin/forgot-password"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                >
                  Request a new reset link
                </Link>
              </div>
            ) : (
              <form action={formAction} className="space-y-5">
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="token" value={token} />

                {state?.error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {state.error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    New Password <span className="text-brand">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="12+ characters, letters and numbers"
                      disabled={pending}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-60"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={pending}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Confirm New Password <span className="text-brand">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Repeat your new password"
                    disabled={pending}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:opacity-60"
                  />
                </div>

                <p className="text-[11px] text-slate-400">
                  Minimum 12 characters, and must contain at least one letter and one number.
                </p>

                <button
                  type="submit"
                  disabled={pending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-strong px-4 py-3 text-sm font-bold text-white shadow-glow-brand transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-brand-strong disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {pending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" />
                      Reset Password
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

            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="size-3.5 text-brand/60" />
              Secure admin access for {siteConfig.productName}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}