"use client";

import {
  Award,
  Users,
  Cloud,
  ShieldCheck,
  BarChart3,
  Wallet,
  Cpu,
  TrendingUp,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Award,
  Users,
  Cloud,
  ShieldCheck,
  BarChart3,
  Wallet,
  Cpu,
  TrendingUp,
};

interface WhyChoosePillarsProps {
  pillars: Array<{ icon: string; title: string; description: string }>;
}

export function WhyChoosePillars({ pillars }: WhyChoosePillarsProps) {
  if (!pillars.length) return null;

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = iconMap[pillar.icon] || Award;
            return (
              <div
                key={pillar.title}
                className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-brand/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand/5 dark:bg-brand/10 text-brand mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
