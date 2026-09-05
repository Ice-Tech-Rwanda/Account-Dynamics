import type { Metadata } from "next";
import Link from "next/link";
import { UnsubscribeForm } from "@/domains/newsletter/components/UnsubscribeForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Unsubscribe from Newsletter",
  description:
    "Unsubscribe from the Account Dynamics newsletter. Enter your email address to stop receiving updates.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function UnsubscribePage() {
  return (
    <div className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="relative rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-soft">
            <div className="pointer-events-none absolute -top-px right-12 h-1 w-24 rounded-b-full bg-gradient-to-r from-brand to-accent" />
            <span className="inline-flex items-center rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
              Newsletter
            </span>
            <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Unsubscribe
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter the email address you subscribed with and we&apos;ll stop
              sending you updates.
            </p>
            <UnsubscribeForm />
          </div>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}