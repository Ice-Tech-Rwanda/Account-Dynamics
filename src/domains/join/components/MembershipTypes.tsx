"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";

const membershipTypes = [
  {
    id: "individual",
    title: "Individual Member",
    description: "For passionate Scrabble players who want to compete, improve, and connect with the community.",
    price: "Free",
    period: "Lifetime",
    popular: true,
    features: [
      "Participate in club tournaments",
      "Access to weekly training sessions",
      "Member ranking & rating tracking",
      "Invitations to special events",
      `${siteConfig.name} community access`,
    ],
    color: "green",
  },
  {
    id: "student",
    title: "Student Member",
    description: "For students in primary or secondary school who want to learn and play Scrabble.",
    price: "Free",
    period: "Per school year",
    features: [
      "School club participation",
      "Scrabble coaching & training",
      "Inter-school tournaments",
      "Educational resources",
      `${siteConfig.name} mentorship program`,
    ],
    color: "green",
  },
  {
    id: "family",
    title: "Family Membership",
    description: "For families who want to enjoy Scrabble together with exclusive benefits and discounts.",
    price: "20,000 RWF",
    period: "Per year",
    features: [
      "Up to 4 family members",
      "All individual member benefits",
      "Family tournament entries",
      "Discounted event registration",
      "Priority workshop access",
    ],
    color: "gold",
  },
  {
    id: "corporate",
    title: "Corporate Member",
    description: "For organizations looking to support Scrabble development and engage their teams.",
    price: "100,000 RWF",
    period: "Per year",
    features: [
      "Up to 10 employee memberships",
      "Corporate team-building events",
      "Brand visibility at tournaments",
      "Named sponsorship opportunities",
      "VIP event access",
    ],
    color: "gold",
  },
];

export function MembershipTypes() {
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
            Membership Options
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Choose Your Path
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Everyone is welcome at {siteConfig.name} — find the membership that fits you best
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {membershipTypes.map((type, i) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
                type.popular
                  ? "border-accent/40 bg-gradient-to-b from-accent/[0.03] to-transparent shadow-lg shadow-accent/10"
                  : "border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-800/30"
              }`}
            >
              {type.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.15em] bg-accent text-black px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{type.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{type.description}</p>
              </div>
              <div className="mb-5">
                <span className={`text-3xl font-black tracking-tight ${type.color === "gold" ? "text-accent" : "text-brand"}`}>
                  {type.price}
                </span>
                <span className="text-sm text-slate-400 ml-1">/{type.period}</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {type.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <Check className={`size-4 mt-0.5 shrink-0 ${type.color === "gold" ? "text-accent" : "text-brand"}`} />
                    {feat}
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className={`rounded-xl w-full gap-2 ${
                  type.popular
                    ? "bg-accent hover:bg-accent-soft text-black shadow-lg shadow-accent/25"
                    : type.color === "gold"
                      ? "bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30"
                      : "bg-brand hover:bg-brand-soft text-white"
                }`}
                onClick={() => document.getElementById("join-forms")?.scrollIntoView({ behavior: "smooth" })}
              >
                Get Started <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
