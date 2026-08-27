"use client";

import { motion } from "framer-motion";

export function ContactHero() {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-br from-slate-950 via-brand-bg-dark to-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(14,124,123,0.08),transparent_50%)]" />
      <div className="relative z-10 it-container px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent border border-accent/20 mb-6">
            Contact Us
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-white"
        >
          Let&apos;s Start a
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-teal-300 to-accent-soft">
            Conversation
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Whether you need tax preparation, bookkeeping, or strategic business
          advisory, we&apos;re here to help. Reach out and let us know how we
          can support your financial goals.
        </motion.p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}
