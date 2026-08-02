"use client";

import { motion } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/site";

type RecentDonor = { donorName: string; amount: number; createdAt: string };

export function DonationHero({ summary }: { summary?: { totalRaised?: number; donorCount?: number; recentDonors?: RecentDonor[] } }) {
  const totalRaised = summary?.totalRaised ?? 18500000;
  const donorCount = summary?.donorCount ?? 45;
  const stats = [
    { label: "Total Raised", value: `${Math.round(totalRaised).toLocaleString()} FRW` },
    { label: "Active Donors", value: `${donorCount}+` },
    { label: "Programs Funded", value: "6" },
    { label: "Youth Supported", value: "300+" },
  ];

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
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
                <Heart className="size-3" /> Support {siteConfig.name}
              </motion.span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                Your Support
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-soft"> Powers</span> Rwanda&apos;s Scrabble Future
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed mb-8">
                Every donation helps us organize tournaments, run school programs,
                support female players, and develop the next generation of Scrabble champions.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#donate-form"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-soft text-black font-bold rounded-xl shadow-lg shadow-accent/25 transition-all"
                >
                  <Heart className="size-4" /> Donate Now
                </a>
                <a
                  href="#sponsorship"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white hover:bg-white/10 font-bold rounded-xl transition-all"
                >
                  Become a Sponsor
                </a>
              </div>
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
                  <span className="text-3xl font-black tracking-tight text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.12em] mt-1 text-slate-400 text-center">
                    {stat.label}
                  </span>
                </motion.div>
              ))}

              <div className="col-span-2 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400 mb-2">Matching Goal</p>
                <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "74%" }}
                    transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    className="h-2.5 rounded-full bg-gradient-to-r from-accent to-accent-soft"
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">{Math.round(totalRaised).toLocaleString()} FRW raised</span>
                  <span className="text-accent font-bold">25M FRW goal</span>
                </div>
              </div>
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
