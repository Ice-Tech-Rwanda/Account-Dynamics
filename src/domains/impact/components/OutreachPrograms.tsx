"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, School, Users, Target } from "lucide-react";

const programs = [
  {
    icon: School,
    title: "School Scrabble Clubs",
    description: "Partnering with 12 schools across Rwanda to establish weekly Scrabble programs. Students develop vocabulary, critical thinking, and confidence through structured gameplay and coaching.",
    image: "/gallery/school-outreach.jpg",
    stats: [{ label: "Partner Schools", value: "12" }, { label: "Students Reached", value: "500+" }],
  },
  {
    icon: Users,
    title: "Community Tournaments",
    description: "Regular tournaments open to all ages and skill levels. From weekly club sessions to the annual Rwanda Open, we create competitive opportunities for every player.",
    image: "/gallery/open-2025.jpg",
    stats: [{ label: "Tournaments Held", value: "45+" }, { label: "Participants", value: "1,200+" }],
  },
  {
    icon: BookOpen,
    title: "Coaching & Training",
    description: "Structured training programs led by certified coaches. Weekly sessions cover strategy, vocabulary building, and tournament preparation for players at every level.",
    image: "/gallery/training.jpg",
    stats: [{ label: "Active Coaches", value: "6" }, { label: "Training Sessions", value: "200+" }],
  },
  {
    icon: Target,
    title: "University Scrabble League",
    description: "A competitive league spanning 6 university campuses. Students compete in regular seasons, qualify for playoffs, and represent their institutions at national championships.",
    image: "/gallery/university-finals.jpg",
    stats: [{ label: "Campuses", value: "6" }, { label: "Student Players", value: "200+" }],
  },
];

export function OutreachPrograms() {
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
            Our Programs
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Outreach Programs
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            How we bring Scrabble to communities across Rwanda
          </p>
        </motion.div>

        <div className="space-y-16">
          {programs.map((program, i) => {
            const Icon = program.icon;
            const isReversed = i % 2 === 1;
            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`grid md:grid-cols-2 gap-8 items-center ${isReversed ? "md:direction-rtl" : ""}`}
                style={{ direction: isReversed ? "rtl" : "ltr" }}
              >
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden" style={{ direction: "ltr" }}>
                  <Image
                    src={program.image || "/placeholder.svg"}
                    alt={program.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                </div>
                <div style={{ direction: "ltr" }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand mb-4">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{program.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">{program.description}</p>
                  <div className="flex gap-6">
                    {program.stats.map((stat) => (
                      <div key={stat.label}>
                        <span className="text-2xl font-black text-brand">{stat.value}</span>
                        <span className="text-xs text-slate-400 block mt-0.5">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
