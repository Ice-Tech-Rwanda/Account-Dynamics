"use client";

import { motion } from "framer-motion";
import { Heart, School, Users, Trophy, Check, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";


const donationTypes = [
  {
    icon: Heart,
    title: "General Donation",
    description: `Support all ${siteConfig.name} programs with a one-time or recurring donation. Your contribution goes where it's needed most.`,
    color: "green",
    features: ["Flexible one-time or monthly giving", "Tax-deductible receipts", "Quarterly impact reports", "Newsletter subscription"],
  },
  {
    icon: School,
    title: "School Fund",
    description: "Help us bring Scrabble to schools across Rwanda. Your donation provides boards, training, and coaching.",
    color: "green",
    features: ["Spell boards for partner schools", "Coach training materials", "Inter-school tournaments", "Student achievement awards"],
  },
  {
    icon: Users,
    title: "Women & Girls Fund",
    description: "Empower female players through dedicated programs, coaching, tournaments, and mentorship opportunities.",
    color: "gold",
    features: ["Women-only tournaments", "Mentorship program", "Leadership training", "Scholarship support"],
  },
  {
    icon: Trophy,
    title: "Tournament Fund",
    description: "Fund prize pools, venues, and logistics for national and regional Scrabble tournaments across Rwanda.",
    color: "gold",
    features: ["Prize pool contributions", "Venue & equipment", "Player travel support", "Live streaming & coverage"],
  },
];

export function DonationTypes() {
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
            Ways to Give
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Choose Your Impact Area
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Every donation creates real change. Select the area that matters most to you.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {donationTypes.map((type, i) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${
                  type.color === "gold" ? "bg-accent/10 text-accent" : "bg-brand/10 text-brand"
                } group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{type.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">{type.description}</p>
                <ul className="space-y-2 mb-6">
                  {type.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Check className={`size-3.5 mt-0.5 shrink-0 ${type.color === "gold" ? "text-accent" : "text-brand"}`} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="#donate-form"
                  className={`inline-flex items-center gap-1.5 text-sm font-bold transition-colors ${
                    type.color === "gold" ? "text-accent hover:text-accent-soft" : "text-brand hover:text-brand-soft"
                  }`}
                >
                  Donate to this fund <ArrowRight className="size-3.5" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
