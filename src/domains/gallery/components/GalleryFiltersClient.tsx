"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "All Media" },
  { value: "tournaments", label: "Tournaments" },
  { value: "meetups", label: "Meetups" },
  { value: "school-programs", label: "School Programs" },
  { value: "university-events", label: "University Events" },
];

export function GalleryFiltersClient({ active }: { active: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get('category') || active || 'all');
  const [announce, setAnnounce] = useState('');

  useEffect(() => {
    if (!announce) return;
    const t = setTimeout(() => setAnnounce(''), 2000);
    return () => clearTimeout(t);
  }, [announce]);

  function applyCategory(value: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value === 'all') params.delete('category'); else params.set('category', value);
    params.delete('page');
    router.push(`/gallery?${params.toString()}`);
    setAnnounce(value === 'all' ? 'Showing all media' : `Filtered by ${value}`);
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Gallery categories">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => applyCategory(cat.value)}
            role="tab"
            aria-selected={current === cat.value}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border",
              current === cat.value
                ? "bg-brand text-white border-brand shadow-lg shadow-brand/20"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand/30 hover:text-brand"
            )}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      <div aria-live="polite" className="sr-only">{announce}</div>
    </div>
  );
}
