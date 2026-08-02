"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { StatCounter } from "@/components/shared/StatCounter";
import { siteConfig } from "@/lib/site";

export function ShopHero() {
  return (
    <section className="relative min-h-[50vh] sm:min-h-[55vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/shop/board.jpg" alt="Shop" fill className="object-cover" priority sizes="100vw" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,168,67,0.08),transparent_50%)]" />

      <div className="relative z-10 w-full px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-flex items-center rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent mb-4">
              Shop
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.06] tracking-[-0.03em] text-white">
              Scrabble Boards, Books &{" "}
              <span className="text-accent">Merchandise</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Official {siteConfig.name} merchandise and Scrabble essentials. Everything you need for the perfect game.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl"
          >
            <StatCounter label="Products" value={8} icon="Package" dark />
            <StatCounter label="Categories" value={4} icon="Tag" dark />
            <StatCounter label="In Stock" value={210} suffix="+" icon="ShoppingBag" dark />
            <StatCounter label="Free Delivery" value={1} suffix="K+" icon="Truck" dark />
          </motion.div>
        </div>
      </div>
    </section>
  );
}