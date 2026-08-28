"use client";

import { Calculator, Cloud, TrendingUp, BarChart3 } from "lucide-react";
import { serviceHighlights } from "@/lib/data/services";

const iconMap: Record<string, React.ElementType> = {
  Calculator,
  Cloud,
  TrendingUp,
  BarChart3,
};

export function ServiceHighlights() {
  return (
    <section className="relative py-16 sm:py-20 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/50">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {serviceHighlights.map((item) => {
            const Icon = iconMap[item.icon] || Calculator;
            return (
              <div
                key={item.title}
                className="group text-center p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-brand/20 dark:hover:border-brand/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand/5 dark:bg-brand/10 text-brand mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
