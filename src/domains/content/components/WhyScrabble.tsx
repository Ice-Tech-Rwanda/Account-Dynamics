"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, GraduationCap, Handshake, TrendingUp, Check } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Brain, GraduationCap, Handshake, TrendingUp,
};

interface BenefitStat {
  label: string
  value: string
}

interface Benefit {
  id: string
  icon: string
  title: string
  description: string
  stats: BenefitStat[]
}

function Counter({ value, suffix }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const numValue = parseInt(value.replace(/\D/g, ""));

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(numValue / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= numValue) {
        setCount(numValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, numValue]);

  return <span ref={ref}>{count}{suffix || ""}</span>;
}

export function WhyScrabble({ benefits }: { benefits: Benefit[] }) {
  return (
    <section className="py-20 sm:py-28 px-4 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Why Scrabble</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
            More Than a Game
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Scrabble is a powerful tool for education, cognitive development, and community building.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {benefits.map((benefit, i) => {
            const Icon = iconMap[benefit.icon] || Brain;
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand/5 to-transparent rounded-bl-full" />

                <div className="relative z-10">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex-shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-brand to-emerald-600 flex items-center justify-center shadow-lg shadow-brand/20">
                      <Icon className="size-5 sm:size-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {benefit.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex gap-6 sm:gap-8">
                      {benefit.stats.map((stat) => (
                        <div key={stat.label}>
                          <span className="text-xl sm:text-2xl font-black text-brand">
                            <Counter value={stat.value} />
                          </span>
                          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium uppercase tracking-wider">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {[
              "Builds vocabulary", "Enhances math skills", "Improves memory",
              "Develops strategy", "Boosts confidence", "Connects communities",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300"
              >
                <Check className="size-3.5 sm:size-4 text-brand" />
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
