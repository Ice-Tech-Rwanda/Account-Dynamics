"use client";

import { motion } from "framer-motion";
import { Target, Eye, Heart, Trophy, Users, BookOpen, Shield, Lightbulb } from "lucide-react";
import { siteConfig } from "@/lib/site";

const iconMap: Record<string, React.ElementType> = {
  Trophy, Users, BookOpen, Heart, Shield, Lightbulb,
};

interface CoreValue {
  id: string
  icon: string
  title: string
  description: string
}

const mvvItems = [
  {
    id: "mission",
    icon: Target,
    title: "Mission",
    description: "To promote and grow the game of Scrabble in Rwanda by providing accessible training, organizing competitive tournaments, and building an inclusive community that fosters excellence, education, and friendship through wordplay.",
    gradient: "from-brand to-emerald-600",
  },
  {
    id: "vision",
    icon: Eye,
    title: "Vision",
    description: "To establish Rwanda as a premier Scrabble destination in Africa, producing world-class players who compete at the highest levels while using Scrabble as a vehicle for education, youth empowerment, and community development.",
    gradient: "from-accent to-amber-500",
  },
];

export function MissionVisionValues({ coreValues }: { coreValues: CoreValue[] }) {
  return (
    <section className="py-20 sm:py-28 px-4 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Purpose</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
            Mission, Vision & Values
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            The principles that drive everything we do at {siteConfig.name}.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 mb-16">
          {mvvItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg mb-5`}>
                    <Icon className="size-5 sm:size-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Core Values
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            The foundation of our club culture.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {coreValues.map((value, i) => {
            const Icon = iconMap[value.icon] || Heart;
            return (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group relative rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 text-center hover:border-brand/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-brand/10 dark:bg-brand/20 mb-3 group-hover:bg-brand group-hover:shadow-lg group-hover:shadow-brand/20 transition-all duration-300">
                  <Icon className="size-4 sm:size-5 text-brand group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors">
                  {value.title}
                </h4>
                <p className="mt-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed hidden sm:block">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
