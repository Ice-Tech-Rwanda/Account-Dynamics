"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Loader2, AlertCircle, Send } from "lucide-react";
import { submitErrorMessage } from "@/lib/client/submit-errors";

type State = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (company.trim()) {
      setState("success");
      return;
    }
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        throw new Error(await submitErrorMessage(res, "We couldn't subscribe you right now. Please try again."));
      }
      setState("success");
    } catch (err) {
      console.error("Newsletter subscription failed", err);
      setError(err instanceof Error ? err.message : "We couldn't subscribe you right now. Please try again.");
      setState("error");
    }
  }

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        Newsletter
      </h3>
      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
        Monthly accounting, tax and advisory insights. No spam, unsubscribe
        anytime.
      </p>

      {state === "success" ? (
        <p className="mt-4 flex items-start gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="mt-0.5 size-4 shrink-0" />
          You&apos;re subscribed. Welcome!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4" noValidate>
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="nl-company">Company</label>
            <input
              type="text"
              name="company"
              id="nl-company"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="flex w-full max-w-sm gap-2">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="nl-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                placeholder="you@example.com"
                aria-label="Email address"
              />
            </div>
            <Button
              type="submit"
              variant="brand"
              size="sm"
              disabled={state === "loading"}
              className="gap-1.5 rounded-xl"
              aria-label="Subscribe to newsletter"
            >
              {state === "loading" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Send className="size-4" /> Subscribe
                </>
              )}
            </Button>
          </div>

          {state === "error" && error && (
            <p
              role="alert"
              className="mt-3 flex items-start gap-1.5 text-xs text-red-500"
            >
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}