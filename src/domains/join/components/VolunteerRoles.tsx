"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Megaphone, School, Heart, Shield, ArrowRight } from "lucide-react";

const roles = [
  {
    icon: Calendar,
    title: "Event Coordinator",
    description: "Help organize tournaments, workshops, and social gatherings. Manage logistics, schedules, and on-site coordination.",
    commitment: "5-10 hrs/week",
  },
  {
    icon: Users,
    title: "Coach & Trainer",
    description: "Share your Scrabble knowledge by coaching beginners, running training sessions, and developing player strategies.",
    commitment: "3-6 hrs/week",
  },
  {
    icon: Megaphone,
    title: "Social Media & Comms",
    description: "Manage our social channels, create engaging content, write newsletters, and amplify our community stories.",
    commitment: "4-8 hrs/week",
  },
  {
    icon: School,
    title: "School Outreach",
    description: "Visit schools to introduce Scrabble programs, train teachers, and help establish school clubs.",
    commitment: "4-6 hrs/week",
  },
  {
    icon: Heart,
    title: "Fundraising & Sponsorship",
    description: "Help secure funding, build sponsor relationships, organize fundraising events, and manage donor communications.",
    commitment: "3-5 hrs/week",
  },
  {
    icon: Shield,
    title: "Tournament Official",
    description: "Serve as a referee or judge at tournaments, ensure fair play, and maintain competition standards.",
    commitment: "Per tournament",
  },
];

export function VolunteerRoles() {
  return (
    <section className="py-20 sm:py-28 bg-brand-bg-dark relative overflow-hidden">
      <div className="it-hero-glow absolute inset-0 opacity-[0.03]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3 inline-block">
            Volunteer
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Volunteer Opportunities
          </h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-lg">
            Lend your skills and passion to grow the Scrabble community in Rwanda
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, i) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-accent/20 transition-all duration-300"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{role.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{role.description}</p>
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
                  {role.commitment}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button
            size="xl"
            className="rounded-xl bg-accent hover:bg-accent-soft text-black font-bold gap-2"
            onClick={() => document.getElementById("join-forms")?.scrollIntoView({ behavior: "smooth" })}
          >
            Apply to Volunteer <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
