"use client";

import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const advisoryItems = [
  {
    icon: BarChart3,
    title: "Financial Analysis",
    description: "Understand your business performance through detailed financial analysis and reporting.",
  },
  {
    icon: DollarSign,
    title: "Cost Comparison",
    description: "Identify cost-saving opportunities by comparing expenses and benchmarking against industry standards.",
  },
  {
    icon: TrendingUp,
    title: "Tax Planning",
    description: "Strategic tax planning to minimize your tax burden while maintaining full compliance.",
  },
  {
    icon: Target,
    title: "Business Planning",
    description: "Develop actionable business plans aligned with your growth objectives and financial targets.",
  },
  {
    icon: Lightbulb,
    title: "Data-Driven Decisions",
    description: "Use financial data and analytics to make informed, confident business decisions.",
  },
];

export function AdvisorySection() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent mb-4">
              Business Advisory
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Turn Financial Data Into Better Business Decisions
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              We help business owners move beyond basic bookkeeping by using
              financial information to identify patterns, understand costs, plan
              ahead and make informed decisions.
            </p>
            <div className="mt-8">
              <Link href="/why-choose-us">
                <Button variant="brand" className="gap-2 rounded-xl">
                  Learn More <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Advisory items */}
          <div className="space-y-4">
            {advisoryItems.map((item) => (
              <div
                key={item.title}
                className="group flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 hover:border-brand/20 hover:shadow-md transition-all duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand/5 dark:bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
