"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function AboutHero() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero/slide-2.jpg"
          alt={`${siteConfig.name} About`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,168,67,0.12),transparent_50%)]" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent border border-accent/20 mb-6">
            About {siteConfig.name}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.04] tracking-[-0.04em] text-white"
        >
          Our Story, Mission &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-300">
            Team
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-5 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          Discover the journey of {siteConfig.name} — from a small gathering of 8 enthusiasts
          to Rwanda&apos;s premier Scrabble community, shaping champions and building minds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          <motion.a
            href="#history"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Our History
          </motion.a>
          <motion.a
            href="#leadership"
            className="inline-flex items-center gap-2 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 px-5 py-2.5 text-sm font-medium text-accent hover:bg-accent/30 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Leadership Team
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="size-6 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
