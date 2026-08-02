"use client";

import { Search, X, BookOpen, FileText, Download, Video } from "lucide-react";
import type { Resource } from "@/domains/resources/domain";

const categories = [
  { id: "all", label: "All Resources", icon: BookOpen },
  { id: "guide", label: "Guides", icon: BookOpen },
  { id: "article", label: "Articles", icon: FileText },
  { id: "tutorial", label: "Tutorials", icon: Video },
  { id: "download", label: "Downloads", icon: Download },
];

interface Props {
  resources?: Resource[]
  counts?: { all: number; guide: number; article: number; tutorial: number; download: number }
  search?: string
  category?: string
  onSearchChange?: (v: string) => void
  onCategoryChange?: (v: string) => void
  onReset?: () => void
}

export function ResourceFilters({ resources = [], counts, search = "", category = "all", onSearchChange = () => {}, onCategoryChange = () => {}, onReset = () => {} }: Props) {
  const hasFilters = search || category !== "all";
  const countsComputed = counts ?? {
    all: resources.length,
    guide: resources.filter((r) => r.category === "guide").length,
    article: resources.filter((r) => r.category === "article").length,
    tutorial: resources.filter((r) => r.category === "tutorial").length,
    download: resources.filter((r) => r.category === "download").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
          />
        </div>
        {hasFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-brand font-medium hover:underline whitespace-nowrap"
          >
            <X className="size-3" /> Clear
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = category === cat.id;
              const count = countsComputed[cat.id as keyof typeof countsComputed];
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition-all ${
                isActive
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <Icon className={`size-3.5 ${isActive ? "" : "text-slate-400 dark:text-slate-500"}`} />
              {cat.label}
              <span className={`${isActive ? "text-white/70" : "text-slate-400"} text-[9px]`}>({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}