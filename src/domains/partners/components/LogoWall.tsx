"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Building2, Handshake, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Partner } from "../domain";

const typeColors: Record<string, string> = {
  platinum: "border-accent/30 bg-gradient-to-br from-accent/5 to-transparent",
  gold: "border-brand/30 bg-gradient-to-br from-brand/5 to-transparent",
  silver: "border-slate-300/30 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-800/30",
  bronze: "border-amber-600/20 bg-gradient-to-br from-amber-50/30 to-transparent dark:from-amber-900/10",
};

const typeIcons: Record<string, React.ElementType> = {
  sponsor: Building2,
  partner: Handshake,
  media: Newspaper,
};

const tierOrder = ["platinum", "gold", "silver", "bronze"];

export function LogoWall({ partners }: { partners: Partner[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sorted = [...partners].sort((a, b) => {
    const ai = tierOrder.indexOf(a.tier || "bronze");
    const bi = tierOrder.indexOf(b.tier || "bronze");
    return ai - bi;
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {sorted.map((partner, i) => {
        const Icon = typeIcons[partner.type] || Building2;
        const isHovered = hoveredId === partner.id;
        return (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            onMouseEnter={() => setHoveredId(partner.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={cn(
              "group relative rounded-xl border p-4 sm:p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
              typeColors[partner.tier || "bronze"],
              "bg-white dark:bg-slate-900"
            )}
          >
            <div className={cn(
              "mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl transition-all duration-300",
              isHovered ? "bg-brand/20 scale-110" : "bg-slate-100 dark:bg-slate-800"
            )}>
              <Icon className={cn(
                "size-6 sm:size-7 transition-all duration-300",
                isHovered ? "text-brand" : "text-slate-400"
              )} />
            </div>

            <h3 className={cn(
              "mt-3 text-xs sm:text-sm font-bold transition-colors duration-300",
              isHovered ? "text-brand" : "text-slate-900 dark:text-white"
            )}>
              {partner.name}
            </h3>

            <span className={cn(
              "mt-2 inline-block rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider transition-all duration-300",
              partner.tier === "platinum" ? "bg-accent/15 text-accent" :
              partner.tier === "gold" ? "bg-brand/15 text-brand" :
              partner.tier === "silver" ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300" :
              "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            )}>
              {partner.tier}
            </span>

            <p className="mt-1 text-[9px] text-slate-400 uppercase tracking-wider">{partner.type}</p>

            <div className={cn(
              "absolute inset-0 rounded-xl flex items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-4 transition-all duration-300",
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {partner.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
