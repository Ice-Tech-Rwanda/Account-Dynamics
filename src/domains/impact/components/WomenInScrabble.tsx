"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Star, Shield } from "lucide-react";
import { siteConfig } from "@/lib/site";

const features = [
  { icon: Heart, text: "Safe and supportive learning environment" },
  { icon: Users, text: "Regular women-only tournaments and meetups" },
  { icon: Star, text: "Mentorship from experienced female players" },
  { icon: Shield, text: "Leadership and coaching development" },
];

const womenStats = [
  { label: "Women Players", value: "45+" },
  { label: "Female Coaches", value: "4" },
  { label: "Women's Events", value: "8" },
  { label: "Active Mentees", value: "30+" },
];

export function WomenInScrabble() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-brand-bg-dark via-brand-bg-dark-mid to-brand relative overflow-hidden">
      <div className="it-hero-glow absolute inset-0 opacity-[0.05]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4 border border-accent/30 px-3 py-1 rounded-full"
            >
              <Heart className="size-3" /> Women in Scrabble
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-5">
              Empowering Women Through Words
            </h2>
            <p className="text-base text-slate-300 leading-relaxed mb-6">
              Our Women in Scrabble program creates a welcoming space for female players
              to learn, compete, and lead. We believe Scrabble is a powerful tool for
              building confidence, strategic thinking, and community among women in Rwanda.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {womenStats.map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <span className="text-xl font-black text-accent block">{stat.value}</span>
                  <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-slate-400">{stat.label}</span>
                </div>
              ))}
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <li key={feat.text} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
                      <Icon className="size-4" />
                    </div>
                    {feat.text}
                  </li>
                );
              })}
            </ul>

            <Button
              size="lg"
              className="rounded-xl bg-accent hover:bg-accent-soft text-black gap-2 shadow-lg shadow-accent/20"
              onClick={() => document.getElementById("impact-gallery")?.scrollIntoView({ behavior: "smooth" })}
            >
              Join the Program <ArrowRight className="size-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-80 sm:h-96 rounded-2xl overflow-hidden"
          >
            <Image
              src="/team/women.jpg"
              alt="Women in Scrabble"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg-dark/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white/80 text-sm italic leading-relaxed">
                &ldquo;{siteConfig.name} gave me the confidence to compete and lead. Today I&apos;m mentoring
                30+ women who are discovering their own potential through Scrabble.&rdquo;
              </p>
              <p className="text-accent text-xs font-bold mt-2">— Jeanne d&apos;Arc Uwase, Women&apos;s Program Lead</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
