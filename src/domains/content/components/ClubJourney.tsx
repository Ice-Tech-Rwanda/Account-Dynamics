"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, Calendar, Globe, Building2, Trophy, School, Award, Home, TrendingUp } from "lucide-react";

interface Milestone {
  icon: string
  year: string
  title: string
  description: string
}

const iconMap: Record<string, React.ElementType> = {
  Flag, Calendar, Globe, Building2, Trophy, School, Award, Home, TrendingUp,
};

export function ClubJourney({ milestones }: { milestones: Milestone[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28 px-4 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Timeline</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
            Club Journey
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Key milestones in our growth from a small club to a national movement.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2" />

          <div className="space-y-4 sm:space-y-0">
            {milestones.map((milestone, i) => {
              const Icon = iconMap[milestone.icon] || Flag;
              const isLeft = i % 2 === 0;
              const isActive = activeIndex === i;

              return (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className={`relative sm:flex items-center ${
                    isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                  } ${i > 0 ? "sm:-mt-8" : ""}`}
                >
                  <div className={`flex-1 ${isLeft ? "sm:text-right sm:pr-12" : "sm:text-left sm:pl-12"}`}>
                    <motion.button
                      onClick={() => setActiveIndex(isActive ? null : i)}
                      className={`group inline-flex items-center gap-3 sm:gap-4 rounded-xl border p-4 sm:p-5 w-full sm:w-auto transition-all duration-300 ${
                        isActive
                          ? "border-brand/40 bg-brand/5 dark:bg-brand/10 shadow-lg"
                          : "border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand/30 hover:shadow-md"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-brand text-white shadow-lg shadow-brand/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-brand/10 group-hover:text-brand"
                      }`}>
                        <Icon className="size-4 sm:size-5" />
                      </div>
                      <div className="text-left">
                        <span className="text-lg sm:text-xl font-black text-brand">{milestone.year}</span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{milestone.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{milestone.description}</p>
                      </div>
                    </motion.button>
                  </div>

                  <div className="hidden sm:flex relative z-10 flex-shrink-0 w-0 items-center justify-center">
                    <div className={`h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                      isActive ? "border-brand bg-brand scale-150" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    }`} />
                  </div>

                  <div className="flex-1 sm:invisible" />
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {activeIndex !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 max-w-2xl mx-auto overflow-hidden"
            >
              <div className="rounded-xl bg-gradient-to-br from-brand/5 to-accent/5 dark:from-brand/10 dark:to-accent/10 border border-brand/20 p-5 text-center">
                <span className="text-3xl font-black text-brand">{milestones[activeIndex].year}</span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {milestones[activeIndex].title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {milestones[activeIndex].description}
                  </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
