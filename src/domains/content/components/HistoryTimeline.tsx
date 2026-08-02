"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/lib/site";

interface Milestone {
  year: string
  title: string
  description: string
}

export function HistoryTimeline({ milestones }: { milestones: Milestone[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="history" className="py-20 sm:py-28 px-4 bg-white dark:bg-slate-950">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">History</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
            Our Journey
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            From a handful of Scrabble enthusiasts to a national movement — explore the milestones
            that shaped {siteConfig.name}.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2" />
          <motion.div
            className="absolute left-4 sm:left-1/2 top-0 w-0.5 bg-gradient-to-b from-brand to-accent -translate-x-1/2 origin-top"
            style={{ height: lineHeight }}
          />

          <div className="space-y-12">
            {milestones.map((milestone, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex flex-col sm:flex-row items-start gap-6 sm:gap-0 ${
                    isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${isLeft ? "sm:text-right sm:pr-12" : "sm:text-left sm:pl-12"}`}>
                    <div className={`inline-block ${isLeft ? "sm:text-right" : "sm:text-left"}`}>
                      <span className="text-4xl sm:text-5xl font-black text-brand/20 dark:text-brand/10 select-none leading-none">
                        {milestone.year}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white -mt-1">
                        {milestone.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 flex-shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white dark:bg-slate-900 border-2 border-brand flex items-center justify-center shadow-lg">
                      <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-brand" />
                    </div>
                  </div>

                  <div className="flex-1 sm:invisible" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
