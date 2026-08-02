"use client";

import { motion } from "framer-motion";
import { TrendingUp, DownloadCloud } from "lucide-react";
import { ResourceCard } from "./ResourceCard";
import type { Resource } from "@/domains/resources/domain";

export function PopularResources({ resources }: { resources: Resource[] }) {
  const popular = resources.filter((r) => r.popular).slice(0, 4);

  if (popular.length === 0) return null;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand flex items-center gap-1">
            <TrendingUp className="size-3" /> Popular
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Most Downloaded
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Top resources loved by the community.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400">
          <DownloadCloud className="size-3" />
          <span>Based on download counts</span>
        </div>
      </motion.div>

      <div className="grid gap-3">
        {popular.map((resource, i) => (
          <ResourceCard key={resource.id} resource={resource} index={i} compact />
        ))}
      </div>
    </div>
  );
}