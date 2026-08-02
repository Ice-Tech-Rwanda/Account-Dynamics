"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import { siteConfig } from "@/lib/site";

const statsData = [
  { label: "Active Members", value: 150, suffix: "+", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { label: "Tournaments Held", value: 45, suffix: "+", icon: "M6 9H4.5a2.5 2.5 0 010-5H6m12 0h1.5a2.5 2.5 0 010 5H18M6 9v6m12-6v6M6 15h12m-6-6V3M6 21h12" },
  { label: "Students Reached", value: 500, suffix: "+", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { label: "Partner Schools", value: 12, suffix: "", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { label: "Young Players", value: 300, suffix: "+", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { label: "Women Players", value: 45, suffix: "+", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
];

function StatItem({ label, value, suffix, icon, index }: { label: string; value: number; suffix?: string; icon: string; index: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) { setCount(value); clearInterval(timer); }
            else { setCount(Math.floor(current)); }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
    >
      <svg className="size-5 text-accent mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">{count}{suffix}</span>
      <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.12em] mt-0.5 text-slate-400 text-center">{label}</span>
    </motion.div>
  );
}

export function ImpactHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-bg-dark via-brand-bg-dark-mid to-brand" />
      <div className="it-hero-glow absolute inset-0 opacity-[0.07]" />

      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4 border border-accent/30 px-3 py-1 rounded-full"
              >
                <Heart className="size-3" /> Our Impact
              </motion.span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                Changing Lives{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-soft">
                  One Word
                </span>{" "}
                at a Time
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-xl mb-4 leading-relaxed">
                Since 2018, {siteConfig.name} has been transforming lives through the power of Scrabble —
                building literacy, confidence, and community across Rwanda.
              </p>
              <p className="text-base text-slate-400 max-w-xl leading-relaxed">
                From school outreach programs to national championships, every game we play
                creates opportunities for growth, connection, and excellence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {statsData.map((stat, i) => (
                <StatItem key={stat.label} {...stat} index={i} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown className="size-6 text-white/40 animate-bounce" />
      </motion.div>
    </section>
  );
}
