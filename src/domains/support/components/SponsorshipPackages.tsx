"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SponsorshipPackage } from "@/domains/support/domain";
import { siteConfig } from "@/lib/site";

export function SponsorshipPackages({ packages = [] }: { packages?: SponsorshipPackage[] }) {
  if (!packages || packages.length === 0) return null;

  return (
    <section id="sponsorship" className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">
            Corporate Sponsorship
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Sponsorship Packages
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Partner with {siteConfig.name} and align your brand with Rwanda&apos;s premier Scrabble community
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
                pkg.popular
                  ? "border-accent/40 bg-gradient-to-b from-accent/[0.03] to-transparent shadow-lg shadow-accent/10"
                  : "border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-800/30"
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] bg-accent text-black px-3 py-1 rounded-full">
                  <Star className="size-3" /> Most Popular
                </span>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{pkg.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pkg.description}</p>
              </div>
              <div className="mb-5">
                <span className="text-2xl font-black text-brand">{pkg.price.toLocaleString()} FRW</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {pkg.benefits.map((benefit: string) => (
                  <li key={benefit} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <Check className="size-3.5 text-brand mt-0.5 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Button
                variant={pkg.popular ? "accent" : "outline"}
                className={`rounded-xl w-full gap-2 text-sm ${
                  pkg.popular ? "shadow-lg shadow-accent/25" : ""
                }`}
                onClick={() => document.getElementById("donate-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                Get Started <ArrowRight className="size-3.5" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
