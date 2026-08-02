"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { ResourceCard } from "./ResourceCard";
import type { Resource } from "@/domains/resources/domain";

export function FeaturedGuides({ resources }: { resources: Resource[] }) {
  const featured = resources.filter((r) => r.featured).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-brand/[0.03] to-transparent dark:from-brand/[0.02]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            <Star className="size-3" /> Featured
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
            Featured Guides
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Our most popular resources hand-picked by the coaching team.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((resource, i) => (
            <ResourceCard key={resource.id} resource={resource} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}