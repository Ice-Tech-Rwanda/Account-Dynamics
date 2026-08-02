"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SponsorshipPackage } from "../domain";

const tierStyles: Record<string, { border: string; bg: string; badge: string }> = {
  Platinum: { border: "border-accent/30", bg: "bg-gradient-to-b from-accent/5 to-transparent", badge: "bg-accent text-slate-950" },
  Gold: { border: "border-brand/30", bg: "bg-gradient-to-b from-brand/5 to-transparent", badge: "bg-brand text-white" },
  Silver: { border: "border-slate-300/30", bg: "bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-800/30", badge: "bg-slate-400 text-white" },
  Bronze: { border: "border-amber-600/20", bg: "bg-gradient-to-b from-amber-50/30 to-transparent dark:from-amber-900/10", badge: "bg-amber-600 text-white" },
};

export function PartnershipPackages({ packages }: { packages: SponsorshipPackage[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {packages.map((pkg, i) => {
        const style = tierStyles[pkg.name] || tierStyles.Bronze;
        return (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={cn(
              "relative rounded-2xl border-2 bg-white dark:bg-slate-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
              style.border, style.bg,
              pkg.popular ? "shadow-lg" : "shadow-sm"
            )}
          >
            {pkg.popular && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-0.5 text-[9px] font-bold text-slate-950 shadow-md">
                  <Sparkles className="size-2.5" /> Most Popular
                </span>
              </div>
            )}

            <h3 className={cn(
              "text-base font-black",
              pkg.name === "Platinum" ? "text-accent" : pkg.name === "Gold" ? "text-brand" : "text-slate-900 dark:text-white"
            )}>
              {pkg.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{pkg.description}</p>

            <div className="mt-4 py-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                RWF {pkg.price.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 ml-1">/year</span>
            </div>

            <ul className="mt-3 space-y-2">
              {pkg.benefits.map((benefit: string) => (
                <li key={benefit} className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <Check className="size-3 text-brand mt-0.5 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>

            <Button
              variant={pkg.popular ? "brand" : "outline"}
              className="w-full rounded-xl mt-5 text-xs h-9 gap-1.5"
            >
              Get Started <ArrowRight className="size-3.5" />
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
