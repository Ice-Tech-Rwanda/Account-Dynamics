"use client";

import { motion } from "framer-motion";
import { Building2, Handshake, Newspaper, Calendar, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Partner } from "../domain";

const typeIcons: Record<string, React.ElementType> = {
  sponsor: Building2,
  partner: Handshake,
  media: Newspaper,
};

const tierStyles: Record<string, string> = {
  platinum: "border-accent/30 shadow-accent/5",
  gold: "border-brand/30 shadow-brand/5",
  silver: "border-slate-300/30",
  bronze: "border-amber-600/20",
};

export function PartnerSpotlightCards({ partners }: { partners: Partner[] }) {
  const spotlight = partners.filter((p) => p.spotlight);

  if (spotlight.length === 0) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {spotlight.map((partner, i) => {
        const Icon = typeIcons[partner.type] || Building2;
        return (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={cn(
              "group relative rounded-2xl border-2 bg-white dark:bg-slate-900 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
              tierStyles[partner.tier || "silver"]
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl transition-all duration-300",
                partner.tier === "platinum" ? "bg-accent/10" : partner.tier === "gold" ? "bg-brand/10" : "bg-slate-100 dark:bg-slate-800"
              )}>
                <Icon className={cn(
                  "size-6 sm:size-7",
                  partner.tier === "platinum" ? "text-accent" : partner.tier === "gold" ? "text-brand" : "text-slate-400"
                )} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {partner.name}
                  </h3>
                  <Badge variant={partner.tier === "platinum" ? "accent" : "brand"} className="text-[8px] uppercase tracking-wider flex-shrink-0">
                    {partner.tier}
                  </Badge>
                </div>
                <p className="mt-1 text-[11px] text-slate-400 uppercase tracking-wider">{partner.type}</p>
              </div>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {partner.description}
            </p>

            {partner.stats && partner.stats.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {partner.stats.map((stat: { label: string; value: string }) => (
                  <div key={stat.label} className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-2.5 text-center">
                    <p className="text-xs sm:text-sm font-black text-brand">{stat.value}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {partner.yearEstablished && (
              <p className="mt-3 text-[10px] text-slate-400 flex items-center gap-1">
                <Calendar className="size-3" /> Partner since {partner.yearEstablished}
              </p>
            )}

            {partner.website && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-soft transition-colors group/link"
                >
                  Visit Website <ExternalLink className="size-3 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
