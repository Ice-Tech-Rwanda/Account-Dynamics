"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Lightbulb, Trophy, Rocket } from "lucide-react";

const initiatives = [
  {
    icon: Sparkles,
    title: "Junior Scrabble Program",
    description: "Age-appropriate Scrabble sessions for children under 13. Focused on building vocabulary, spelling confidence, and a love for word games through fun activities.",
    color: "green",
  },
  {
    icon: Lightbulb,
    title: "School Competitions",
    description: "Regular inter-school tournaments where young players compete, build sportsmanship, and earn recognition for their schools and communities.",
    color: "green",
  },
  {
    icon: Trophy,
    title: "Youth Championships",
    description: "Dedicated youth divisions at every major tournament with age-group categories, trophies, and pathways to national team selection.",
    color: "gold",
  },
  {
    icon: Rocket,
    title: "Mentorship Program",
    description: "Experienced players mentor young talents through one-on-one coaching, strategy sessions, and tournament preparation guidance.",
    color: "gold",
  },
];

const youthStats = [
  { label: "Young Players", value: "300+" },
  { label: "Partner Schools", value: "12" },
  { label: "Youth Tournaments", value: "20+" },
  { label: "Junior Champions", value: "8" },
];

export function YouthInitiatives() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/[0.02] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/[0.02] rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">
            Youth Development
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Investing in the Next Generation
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Building skills, confidence, and lifelong friendships through Scrabble
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-72 sm:h-96 rounded-2xl overflow-hidden"
          >
            <Image
              src="/gallery/school-outreach.jpg"
              alt="Youth Scrabble Program"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {youthStats.map((stat) => (
                  <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                    <span className="text-lg font-black text-accent block">{stat.value}</span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/70">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid gap-5">
              {initiatives.map((item, _i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex gap-4 p-4 rounded-xl bg-brand-bg dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/50 hover:border-brand/20 transition-colors"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      item.color === "gold" ? "bg-accent/10 text-accent" : "bg-brand/10 text-brand"
                    }`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="xl"
            className="rounded-xl bg-brand hover:bg-brand-soft text-white gap-2"
            onClick={() => document.getElementById("impact-gallery")?.scrollIntoView({ behavior: "smooth" })}
          >
            See Youth Programs in Action <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
