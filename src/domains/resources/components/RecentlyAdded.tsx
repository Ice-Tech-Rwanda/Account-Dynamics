"use client";

import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { ResourceCard } from "./ResourceCard";
import type { Resource } from "@/domains/resources/domain";
import { siteConfig } from "@/lib/site";

export function RecentlyAdded({ resources }: { resources: Resource[] }) {
  const sorted = [...resources].sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());
  const recent = sorted.slice(0, 4);

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
            <Sparkles className="size-3" /> New
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Recently Added
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest resources from the {siteConfig.name} team.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400">
          <Clock className="size-3" />
          <span>Most recent first</span>
        </div>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2">
        {recent.map((resource, i) => (
          <ResourceCard key={resource.id} resource={resource} index={i} />
        ))}
      </div>
    </div>
  );
}