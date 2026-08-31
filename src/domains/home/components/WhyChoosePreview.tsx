"use client";

import {
  Award,
  Users,
  Cloud,
  ShieldCheck,
  BarChart3,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Award,
  Users,
  Cloud,
  ShieldCheck,
  BarChart3,
  Wallet,
};

interface WhyChoosePreviewProps {
  pillars: Array<{ icon: string; title: string; description: string }>;
}

export function WhyChoosePreview({ pillars }: WhyChoosePreviewProps) {
  if (!pillars.length) return null;

  // Show first 6 pillars on the homepage preview
  const previewPillars = pillars.slice(0, 6);

  return (
    <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Why Clients Trust Account Dynamics
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            We combine professional expertise with personalized service and modern
            technology to deliver results that matter.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewPillars.map((pillar) => {
            const Icon = iconMap[pillar.icon] || Award;
            return (
              <div
                key={pillar.title}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-brand/20 hover:shadow-lg transition-all duration-300"
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

        <div className="mt-12 text-center">
          <Link href="/why-choose-us">
            <Button variant="brand" className="gap-2 rounded-xl">
              Learn Why <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
