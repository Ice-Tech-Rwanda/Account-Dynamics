"use client";

import { motion } from "framer-motion";
import { industries } from "@/lib/data/industries";
import { CTASection } from "@/domains/home/components/CTASection";
import {
  Store,
  Rocket,
  Building2,
  User,
  Briefcase,
  LayoutGrid,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Store,
  Rocket,
  Building2,
  User,
  Briefcase,
  LayoutGrid,
};

export default function IndustriesPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-br from-slate-950 via-brand-bg-dark to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(14,124,123,0.08),transparent_50%)]" />
        <div className="relative z-10 it-container px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent border border-accent/20 mb-6">
              Industries
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-white"
          >
            Industries We Serve
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            We provide specialized accounting and advisory services to a diverse
            range of clients across different sectors and business sizes.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none" />
      </section>

      {/* Industries grid */}
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
        <div className="it-container px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry) => {
              const Icon = iconMap[industry.icon] || Building2;
              return (
                <div
                  key={industry.name}
                  className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-brand/20 hover:shadow-xl transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand/5 dark:bg-brand/10 text-brand mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="size-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {industry.name}
                  </h2>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {industry.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
