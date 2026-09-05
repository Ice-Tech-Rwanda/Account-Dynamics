"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/lib/site";
import { forgotPasswordAction, type ForgotPasswordState } from "./actions";

function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<
    ForgotPasswordState | undefined,
    FormData
  >(forgotPasswordAction, undefined);

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
            Forgot Your Password?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed font-light"
          >
            We&apos;ll email you a secure link to set a new password for your admin
            account. The link expires in 30 minutes.
          </motion.p>
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
                Reset Password
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter the email address you use to sign in
              </p>
            </div>

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

            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="size-3.5 text-brand/60" />
              Secure admin access for {siteConfig.productName}
            </div>
          </motion.div>

          <p className="mt-6 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {siteConfig.productName}. All
            rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function AdminForgotPasswordPage() {
  return <ForgotPasswordForm />;
}