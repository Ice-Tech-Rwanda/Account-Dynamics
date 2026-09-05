"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Loader2, AlertCircle } from "lucide-react";
import { submitErrorMessage } from "@/lib/client/submit-errors";

type State = "idle" | "loading" | "success" | "error";

export function UnsubscribeForm() {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        throw new Error(await submitErrorMessage(res, "We couldn't process your request. Please try again."));
      }
      setState("success");
    } catch (err) {
      console.error("Unsubscribe failed", err);
      setError(err instanceof Error ? err.message : "We couldn't process your request. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <div className="w-20 h-20 rounded-3xl bg-brand/10 flex items-center justify-center">
          <CheckCircle className="size-10 text-brand" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          You&apos;re Unsubscribed
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
          You will no longer receive the Account Dynamics newsletter. On
          reflection, we hope we can still help you with your accounting needs.
        </p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm pl-11 pr-4 py-3 transition-all focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {state === "error" && error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-600 dark:text-red-400"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="brand"
          size="lg"
          disabled={state === "loading"}
          className="w-full gap-2 rounded-xl py-3"
        >
          {state === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Unsubscribing...
            </>
          ) : (
            "Unsubscribe"
          )}
        </Button>
      </form>
    </div>
  );
}