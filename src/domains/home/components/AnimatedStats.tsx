"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Trophy, GraduationCap, LayoutDashboard } from "lucide-react";

const stats = [
  { label: "Active Members", value: 150, suffix: "+", icon: Users },
  { label: "Tournaments Hosted", value: 45, suffix: "+", icon: Trophy },
  { label: "Schools Engaged", value: 12, suffix: "", icon: GraduationCap },
  { label: "Boards Distributed", value: 500, suffix: "+", icon: LayoutDashboard },
];

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(end / (duration / 16));
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(t); }
      else setCount(start);
    }, 16);
    return () => clearInterval(t);
  }, [inView, end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export function AnimatedStats() {
  return (
    <section className="relative -mt-12 sm:-mt-16 lg:-mt-24 z-20 px-4 pb-8 sm:pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative rounded-2xl border border-white/20 dark:border-white/20 border-slate-200 bg-white/90 dark:bg-white/15 backdrop-blur-xl p-6 sm:p-7 text-center overflow-hidden group shadow-2xl shadow-slate-200/50 dark:shadow-none"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,168,67,0.08),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent mb-4 ring-1 ring-accent/20 group-hover:ring-accent/40 transition-all duration-300">
                    <Icon className="size-5 sm:size-6" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
