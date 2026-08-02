"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Flag, Calendar, Globe, Building2, Trophy, School, Award, Home, TrendingUp } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Flag, Calendar, Globe, Building2, Trophy, School, Award, Home, TrendingUp,
};

export function ImpactTimeline() {
  const [historyMilestones, setHistoryMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-content?section=historyMilestones")
      .then((r) => r.json())
      .then((data) => { setHistoryMilestones(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">
            Our Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Impact Timeline
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            From 8 members in a community center to 150+ active members across Rwanda
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[23px] sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand via-accent to-brand sm:-translate-x-px" />

          <div className="space-y-12">
            {historyMilestones.map((milestone, i) => {
              const Icon = iconMap[milestone.icon] || Flag;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative flex flex-col sm:flex-row items-start gap-6 ${
                    isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  <div className={`hidden sm:block flex-1 ${isLeft ? "text-right pr-8" : "text-left pl-8"}`}>
                    <span className="text-3xl font-black text-brand tracking-tight">{milestone.year}</span>
                  </div>

                  <div className="relative z-10 flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-2 border-brand shadow-md shadow-brand/10">
                      <Icon className="size-5 text-brand" />
                    </div>
                  </div>

                  <div className={`flex-1 ${isLeft ? "sm:text-left" : "sm:text-left"}`}>
                    <span className="text-sm font-bold text-brand sm:hidden block mb-1">{milestone.year}</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{milestone.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{milestone.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
