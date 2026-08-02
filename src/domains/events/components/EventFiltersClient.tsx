"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import type { EventCategory } from "@/domains/events/domain";

export function EventFiltersClient({ categories }: { categories: EventCategory[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialLocation = searchParams.get('location') || '';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [appliedUrl, setAppliedUrl] = useState(`${initialSearch}|${initialCategory}|${initialLocation}`);

  if (appliedUrl !== `${initialSearch}|${initialCategory}|${initialLocation}`) {
    setAppliedUrl(`${initialSearch}|${initialCategory}|${initialLocation}`);
    setSearch(initialSearch);
    setCategory(initialCategory);
    setLocation(initialLocation);
  }

  function applyFilters(vals: { q?: string; category?: string; location?: string }) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (vals.q !== undefined) {
      if (vals.q) params.set('q', vals.q); else params.delete('q');
    }
    if (vals.category !== undefined) {
      if (vals.category) params.set('category', vals.category); else params.delete('category');
    }
    if (vals.location !== undefined) {
      if (vals.location) params.set('location', vals.location); else params.delete('location');
    }
    params.delete('page');
    const url = `/events?${params.toString()}`;
    router.push(url);
  }

  const locations = [...new Set(["Kimironko Community Center, Kigali", "Kigali Convention Center", "Various University Campuses", "KiSC Clubhouse, Kimironko", "Lycee de Kigali"])];

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') applyFilters({ q: search }); }}
            className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); applyFilters({ category: e.target.value }); }}
          className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 appearance-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select
          value={location}
          onChange={(e) => { setLocation(e.target.value); applyFilters({ location: e.target.value }); }}
          className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 appearance-none"
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          {(search || category || location) && (
            <button
              onClick={() => { setSearch(''); setCategory(''); setLocation(''); applyFilters({ q: '', category: '', location: '' }); }}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="size-3" /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
