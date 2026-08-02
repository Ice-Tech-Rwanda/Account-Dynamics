"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site";

const stats = [
  { label: "Active Members", value: 150, suffix: "+", icon: "Users" },
  { label: "Tournaments Held", value: 45, suffix: "+", icon: "Trophy" },
  { label: "School Programs", value: 12, suffix: "", icon: "BookOpen" },
  { label: "Students Reached", value: 500, suffix: "+", icon: "Building2" },
];

const iconMap: Record<string, string> = {
  Users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  Trophy: "M6 9H4.5a2.5 2.5 0 010-5H6m12 0h1.5a2.5 2.5 0 010 5H18M6 9v6m12-6v6M6 15h12m-6-6V3M6 21h12",
  BookOpen: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  Building2: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
};

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
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
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
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex flex-col items-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/20 text-accent mb-3">
        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d={iconMap[icon]} />
        </svg>
      </div>
      <span className="text-3xl font-black tracking-tight text-white">
        {count}{suffix}
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.12em] mt-1 text-slate-400">
        {label}
      </span>
    </motion.div>
  );
}

export function JoinHero() {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-content?section=contactInfo")
      .then((r) => r.json())
      .then((data) => { setContactInfo(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !contactInfo) return null;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-bg-dark via-brand-bg-dark-mid to-brand" />
      <div className="it-hero-glow absolute inset-0 opacity-10" />

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
                transition={{ delay: 0.2 }}
                className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4 border border-accent/30 px-3 py-1 rounded-full"
              >
                Join the Movement
              </motion.span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
                Become a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-soft">
                  {siteConfig.name} Member
                </span>{" "}
                Today
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-xl mb-8 leading-relaxed">
                Join Rwanda&apos;s premier Scrabble community. Play competitively, develop your skills,
                connect with fellow word enthusiasts, and be part of something bigger.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="xl"
                  className="rounded-xl bg-accent hover:bg-accent-soft text-black font-bold gap-2 shadow-lg shadow-accent/25"
                  onClick={() => document.getElementById("join-forms")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Register Now <ArrowRight className="size-4" />
                </Button>
                <a href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  <Button size="xl" variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10 gap-2">
                    <MessageCircle className="size-4" /> Join WhatsApp Group
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
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
