"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Donor } from "@/domains/support/domain";

const tiers = [
  { label: "Platinum", min: 1000000, color: "from-slate-300 to-slate-100", border: "border-slate-300" },
  { label: "Gold", min: 500000, color: "from-accent to-accent-soft", border: "border-accent/30" },
  { label: "Silver", min: 100000, color: "from-slate-400 to-slate-300", border: "border-slate-300" },
  { label: "Bronze", min: 0, color: "from-amber-600 to-amber-500", border: "border-amber-500/30" },
];

function getTier(amount: number) {
  for (const tier of tiers) {
    if (amount >= tier.min) return tier;
  }
  return tiers[tiers.length - 1];
}

export function DonorWall({ donors = [] }: { donors?: Donor[] }) {
  const sorted = [...donors].filter((d) => !d.anonymous).sort((a, b) => b.amount - a.amount);

  if (sorted.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-brand-bg dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">
            Our Supporters
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Donor Recognition Wall
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Thank you to everyone who makes our work possible
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {sorted.map((donor, i) => {
            const tier = getTier(donor.amount);
            return (
              <motion.div
                key={donor.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/50 border shadow-sm hover:shadow-md transition-all",
                  tier.border
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br",
                  tier.color
                )}>
                  <Heart className="size-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {donor.donorName}
                  </p>
                  <span className="text-xs text-brand font-semibold">
                    {donor.amount.toLocaleString()} FRW
                  </span>
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-[0.1em] ml-2",
                    tier.label === "Gold" ? "text-accent" : "text-slate-400"
                  )}>
                    {tier.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-sm text-slate-400">
            We also gratefully acknowledge our anonymous donors who prefer not to be listed publicly.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
