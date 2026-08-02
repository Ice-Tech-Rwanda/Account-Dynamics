"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { EventCategory } from "@/domains/events/domain";

interface EventFiltersProps {
  search: string
  category: string
  location: string
  onSearchChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onLocationChange: (v: string) => void
  onReset: () => void
  categories: EventCategory[]
}

export function EventFilters({ search, category, location, onSearchChange, onCategoryChange, onLocationChange, onReset, categories }: EventFiltersProps) {
  const hasFilters = search || category || location;
  const locations = [...new Set(["Kimironko Community Center, Kigali", "Kigali Convention Center", "Various University Campuses", "KiSC Clubhouse, Kimironko", "Lycee de Kigali"])];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm"
    >
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 appearance-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 appearance-none"
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onReset}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="size-3" /> Reset
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}