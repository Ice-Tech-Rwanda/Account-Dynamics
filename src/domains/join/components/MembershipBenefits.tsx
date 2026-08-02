"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain, GraduationCap, Handshake, Rocket } from "lucide-react";
import { siteConfig } from "@/lib/site";

const benefitIconMap: Record<string, React.ElementType> = {
  Brain, GraduationCap, Handshake, Rocket,
};

export function MembershipBenefits() {
  const [benefits, setBenefits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-content?section=benefits")
      .then((r) => r.json())
      .then((data) => { setBenefits(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-brand-bg dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">
            Why Join
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Benefits of Membership
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Discover what makes {siteConfig.name} more than just a Scrabble club
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefitIconMap[benefit.icon] || Rocket;
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 p-6 hover:shadow-xl hover:shadow-brand/5 hover:border-brand/20 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{benefit.description}</p>
                {benefit.stats && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex gap-4">
                    {benefit.stats.map((stat: { label: string; value: string }) => (
                      <div key={stat.label}>
                        <span className="text-sm font-black text-brand">{stat.value}</span>
                        <span className="text-xs text-slate-400 block">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
