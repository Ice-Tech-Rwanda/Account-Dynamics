"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { School, GraduationCap, BookOpen, Users, Trophy, Medal, ArrowRight } from "lucide-react";

const schoolFeatures = [
  { icon: BookOpen, text: "Free Scrabble boards and resources" },
  { icon: Users, text: "Teacher training and support" },
  { icon: Trophy, text: "Inter-school tournament participation" },
  { icon: Medal, text: "Student recognition programs" },
];

const universityFeatures = [
  { icon: BookOpen, text: "University Scrabble League membership" },
  { icon: Users, text: "Inter-campus competitions" },
  { icon: Trophy, text: "National and regional tournaments" },
  { icon: Medal, text: "Leadership and organizing experience" },
];

export function ClubFeatures() {
  return (
    <section className="py-20 sm:py-28 bg-brand-bg dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">
            Start a Club
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Bring Scrabble to Your School
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            We provide everything you need to start and run a successful Scrabble club
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 p-8 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/10 text-brand mb-5">
              <School className="size-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">School Scrabble Club</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              For primary and secondary schools. We provide resources, training, and a pathway to competitive Scrabble.
            </p>
            <ul className="space-y-3 mb-8">
              {schoolFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <li key={feat.text} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 shrink-0">
                      <Icon className="size-4 text-brand" />
                    </div>
                    {feat.text}
                  </li>
                );
              })}
            </ul>
            <Button
              size="lg"
              className="rounded-xl bg-brand hover:bg-brand-soft text-white w-full gap-2"
              onClick={() => document.getElementById("join-forms")?.scrollIntoView({ behavior: "smooth" })}
            >
              Register Your School <ArrowRight className="size-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 p-8 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent mb-5">
              <GraduationCap className="size-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">University Scrabble Club</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              For universities and tertiary institutions. Join the University Scrabble League and compete at the highest level.
            </p>
            <ul className="space-y-3 mb-8">
              {universityFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <li key={feat.text} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 shrink-0">
                      <Icon className="size-4 text-accent" />
                    </div>
                    {feat.text}
                  </li>
                );
              })}
            </ul>
            <Button
              size="lg"
              className="rounded-xl bg-accent hover:bg-accent-soft text-black w-full gap-2 shadow-lg shadow-accent/20"
              onClick={() => document.getElementById("join-forms")?.scrollIntoView({ behavior: "smooth" })}
            >
              Register Your University <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
