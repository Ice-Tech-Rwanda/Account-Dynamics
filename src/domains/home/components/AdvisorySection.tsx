"use client";

import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  Receipt,
  Search,
  Sparkles,
  Clipboard,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const analyticsFlow = [
  { icon: Receipt, step: "1", label: "Financial Data", hint: "Your raw numbers" },
  { icon: Search, step: "2", label: "Analysis", hint: "Trends & performance" },
  { icon: Sparkles, step: "3", label: "Insights", hint: "What the numbers mean" },
  { icon: Clipboard, step: "4", label: "Planning", hint: "Actions & strategy" },
  { icon: CheckCircle, step: "5", label: "Better Decisions", hint: "Confident next steps" },
];

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
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand mb-4">
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

        {/* Analytics flow */}
        <div className="mt-16">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.16em] text-brand mb-8">
            From Financial Data to Better Business Decisions
          </p>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-2">
            {analyticsFlow.map((step, i) => (
              <div key={step.label} className="flex flex-col md:flex-row items-center gap-3 md:gap-2 w-full md:w-auto flex-1">
                <div className="flex-1 md:flex-none w-full md:w-auto flex flex-col items-center text-center p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-800/40">
                  <div className="w-11 h-11 rounded-xl bg-brand/5 dark:bg-brand/10 text-brand flex items-center justify-center">
                    <step.icon className="size-5" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                    {step.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {step.hint}
                  </p>
                </div>
                {i < analyticsFlow.length - 1 && (
                  <ArrowRight className="size-5 text-slate-300 dark:text-slate-600 shrink-0 rotate-90 md:rotate-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
