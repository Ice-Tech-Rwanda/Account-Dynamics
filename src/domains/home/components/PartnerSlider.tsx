"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface PartnerItem {
  id: string
  name: string
  logo?: string
  tier?: string
  type: string
}

const tierColors: Record<string, { bg: string; text: string }> = {
  platinum: { bg: "from-slate-700 to-slate-900", text: "text-slate-100" },
  gold: { bg: "from-yellow-600 to-yellow-800", text: "text-yellow-100" },
  silver: { bg: "from-slate-400 to-slate-600", text: "text-slate-100" },
  bronze: { bg: "from-amber-700 to-amber-900", text: "text-amber-100" },
};

const defaultTier = { bg: "from-emerald-600 to-emerald-800", text: "text-emerald-100" };

function PartnerLogo({ partner }: { partner: PartnerItem }) {
  const colors = tierColors[partner.tier?.toLowerCase() ?? ""] || defaultTier;
  const initials = partner.name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (partner.logo) {
    return (
      <div className="relative h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
        <Image src={partner.logo} alt={partner.name} fill className="object-contain rounded-xl" sizes="56px" />
      </div>
    );
  }

  return (
    <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br ${colors.bg} shadow-md flex-shrink-0`}>
      <span className={`text-sm font-bold ${colors.text} tracking-tight`}>{initials}</span>
    </div>
  );
}

export function PartnerSlider({ partners }: { partners: PartnerItem[] }) {
  return (
    <section className="relative py-16 sm:py-24 px-4 overflow-hidden bg-white">
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="it-kicker">Partners</span>
          <h2 className="it-title">Trusted By</h2>
        </motion.div>

        {partners.length === 0 ? (
          <p className="text-center text-slate-400 text-sm">Partner information coming soon.</p>
        ) : (
          <div className="relative overflow-hidden">
            <div className="flex gap-12 sm:gap-16 items-center animate-scroll">
              {[...partners, ...partners, ...partners].map((partner, i) => (
                <div key={`${partner.id}-${i}`} className="flex-shrink-0 flex items-center gap-3 sm:gap-4 group">
                  <PartnerLogo partner={partner} />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors whitespace-nowrap">
                      {partner.name}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{partner.tier} {partner.type}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </div>
        )}
      </div>
    </section>
  );
}
