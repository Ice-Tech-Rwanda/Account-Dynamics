"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-brand-bg-dark to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(14,124,123,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(27,58,92,0.06),transparent_50%)]" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
        >
          <div className="inline-flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-[2rem] bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-xl mb-8 ring-1 ring-accent/20">
            <span className="text-4xl sm:text-5xl font-bold text-accent">?</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent border border-accent/20 mb-4">
            <Search className="size-3" /> Page Not Found
          </span>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.06] tracking-tight text-white">
            404
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-lg mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get
            you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link href="/">
            <Button
              variant="accent"
              size="xl"
              className="gap-2.5 rounded-xl shadow-xl shadow-accent/25 hover:shadow-accent/35 transition-all duration-300 text-base"
            >
              <Home className="size-4" /> Back to Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="xl"
              className="rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 gap-2.5 text-base shadow-lg"
            >
              <Phone className="size-4" /> Contact Us
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 text-sm text-slate-500"
        >
          Error 404 &middot; {siteConfig.name}
        </motion.p>
      </div>
    </div>
  );
}
