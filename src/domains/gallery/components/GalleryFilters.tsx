"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "All Media" },
  { value: "tournaments", label: "Tournaments" },
  { value: "meetups", label: "Meetups" },
  { value: "school-programs", label: "School Programs" },
  { value: "university-events", label: "University Events" },
];

export function GalleryFilters({
  active,
  onChange,
}: {
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((cat, i) => (
        <motion.button
          key={cat.value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onChange(cat.value)}
          className={cn(
            "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border",
            active === cat.value
              ? "bg-brand text-white border-brand shadow-lg shadow-brand/20"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand/30 hover:text-brand"
          )}
        >
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
}
