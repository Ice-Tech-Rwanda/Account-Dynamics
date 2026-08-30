"use client";

import { Cloud, Calculator, BarChart3, ShieldCheck } from "lucide-react";
import { technologyItems } from "@/lib/data/technology";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Cloud,
  Calculator,
  BarChart3,
  ShieldCheck,
};

export function TechnologySection() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand mb-4">
              Technology
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Technology That Makes Accounting Simpler
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              We use modern accounting technology and cloud-based, paperless
              workflows so your financial information is organized, accessible
              and easy to understand.
            </p>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Our team includes certified QuickBooks ProAdvisors, so we can help
              you get set up and work confidently within systems that fit your
              business.
            </p>
            <div className="mt-8">
              <Link href="/why-choose-us">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:gap-2 transition-all">
                  Explore Our Approach <ArrowRight className="size-4" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right: items */}
          <div className="space-y-4">
            {technologyItems.map((item) => {
              const Icon = iconMap[item.icon] || Cloud;
              return (
                <div
                  key={item.title}
                  className="group flex gap-4 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-brand/20 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-brand/5 dark:bg-brand/10 text-brand flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
