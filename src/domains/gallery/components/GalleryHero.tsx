"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Play, ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/site";

const stats = [
  { label: "Photos & Videos", value: 19, suffix: "" },
  { label: "Events Covered", value: 12, suffix: "+" },
  { label: "Tournaments", value: 8, suffix: "" },
  { label: "Videos", value: 4, suffix: "" },
];

export function GalleryHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-bg-dark via-brand-bg-dark-mid to-brand" />
      <div className="it-hero-glow absolute inset-0 opacity-[0.06]" />

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
                <ImageIcon className="size-3" /> Media Gallery
              </motion.span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                Moments
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-soft"> Captured</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed">
                A visual journey through {siteConfig.name}&apos;s tournaments, meetups, school programs,
                and university events across Rwanda.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex flex-col items-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  {i < 2 ? (
                    <ImageIcon className="size-5 text-accent mb-2" />
                  ) : (
                    <Play className="size-5 text-accent mb-2" />
                  )}
                  <span className="text-3xl font-black tracking-tight text-white">
                    {stat.value}{stat.suffix}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.12em] mt-1 text-slate-400 text-center">
                    {stat.label}
                  </span>
                </motion.div>
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
