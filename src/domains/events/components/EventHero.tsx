"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/site";

interface EventHeroProps {
  upcomingCount: number;
  pastCount: number;
  totalParticipants: number;
}

export function EventHero({ upcomingCount, pastCount, totalParticipants }: EventHeroProps) {
  const totalUpcoming = upcomingCount;
  const totalPast = pastCount;

  return (
    <section className="relative min-h-[70vh] sm:min-h-[75vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero/slide-3.jpg"
          alt={`${siteConfig.name} Events`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,168,67,0.12),transparent_50%)]" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent border border-accent/20 mb-6">
            <Calendar className="size-3" /> Events & Tournaments
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.04] tracking-[-0.04em] text-white"
        >
          Tournaments, Meetups &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-300">
            Workshops
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-5 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          From weekly gatherings to national championships — find your next Scrabble event
          and be part of Rwanda&apos;s growing Scrabble community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-10"
        >
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-black text-accent">{totalUpcoming}</span>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">Upcoming Events</p>
          </div>
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalPast}</span>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">Past Events</p>
          </div>
          <div className="text-center">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalParticipants}+</span>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">Registered Players</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="size-6 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}