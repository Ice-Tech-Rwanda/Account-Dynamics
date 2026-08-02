"use client";

import { motion } from "framer-motion";
import { Heart, School, Trophy, Users } from "lucide-react";
import { siteConfig } from "@/lib/site";

const impactGoals = [
  {
    icon: Heart,
    title: "One-Time Donation",
    description: `General fund supporting all ${siteConfig.name} programs, tournaments, and operational costs.`,
    raised: 8500000,
    goal: 12000000,
    color: "green",
  },
  {
    icon: School,
    title: "School Fund",
    description: "Provides Scrabble boards, training materials, and coaching for school programs across Rwanda.",
    raised: 3200000,
    goal: 5000000,
    color: "green",
  },
  {
    icon: Users,
    title: "Women & Girls Fund",
    description: "Dedicated to empowering female players through coaching, tournaments, and mentorship programs.",
    raised: 1800000,
    goal: 3000000,
    color: "gold",
  },
  {
    icon: Trophy,
    title: "Tournament Sponsorship",
    description: "Funds prize pools, venue bookings, and logistics for national and regional tournaments.",
    raised: 5000000,
    goal: 5000000,
    color: "gold",
  },
];

export function ImpactVisualization() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">
            Where Your Money Goes
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Donation Impact
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            See how contributions are making a difference across our programs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {impactGoals.map((fund, i) => {
            const Icon = fund.icon;
            const progress = Math.min(Math.round((fund.raised / fund.goal) * 100), 100);
            return (
              <motion.div
                key={fund.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    fund.color === "gold" ? "bg-accent/10 text-accent" : "bg-brand/10 text-brand"
                  }`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{fund.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{fund.description}</p>
                  </div>
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-900 dark:text-white">{fund.raised.toLocaleString()} FRW</span>
                  <span className="text-slate-400">{fund.goal.toLocaleString()} FRW</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      progress >= 100
                        ? "bg-brand"
                        : fund.color === "gold"
                          ? "bg-gradient-to-r from-accent to-accent-soft"
                          : "bg-gradient-to-r from-brand to-brand-soft"
                    }`}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className={`text-xs font-bold ${progress >= 100 ? "text-brand" : "text-slate-500"}`}>
                    {progress}% Funded
                  </span>
                  {progress >= 100 && <span className="text-xs text-brand font-bold">Goal Reached!</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
