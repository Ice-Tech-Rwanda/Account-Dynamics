"use client";

import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function MembershipSection() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand mb-4">
              Membership Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Predictable Pricing, Exceptional Value
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Account Dynamics offers membership plans designed to provide
              affordable, predictable services instead of relying entirely on
              hourly billing. We understand the needs of small business owners
              and have put together plans that give you peace of mind.
            </p>
            <div className="mt-8">
              <Link href={siteConfig.bookOnlineUrl}>
                <Button variant="accent" className="gap-2 rounded-xl">
                  Explore Membership Options <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Feature list */}
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              What You Get
            </h3>
            <ul className="space-y-4">
              {[
                "Predictable monthly pricing",
                "Dedicated accounting support",
                "Cloud-based financial reporting",
                "Tax preparation and filing",
                "Payroll management",
                "CRA compliance support",
                "Business advisory access",
                "Priority client service",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center mt-0.5">
                    <Check className="size-3 text-brand" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-slate-500 dark:text-slate-500 italic">
              Contact us to find the plan that fits your business.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
