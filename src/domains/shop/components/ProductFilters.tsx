"use client";

import { Search, SlidersHorizontal, X, Package } from "lucide-react";
import type { Product } from "@/domains/shop/domain";

const categories = [
  { id: "all", label: "All Products", icon: Package },
  { id: "boards", label: "Boards" },
  { id: "books", label: "Books" },
  { id: "merch", label: "Merchandise" },
  { id: "accessories", label: "Accessories" },
];

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
  { value: "name", label: "Name: A-Z" },
];

interface Props {
  products: Product[]
  search: string
  category: string
  sort: string
  onSearchChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onSortChange: (v: string) => void
  onReset: () => void
}

export function ProductFilters({ products, search, category, sort, onSearchChange, onCategoryChange, onSortChange, onReset }: Props) {
  const hasFilters = search || category !== "all" || sort !== "default";
  const counts = {
    all: products.length,
    boards: products.filter((p) => p.category === "boards").length,
    books: products.filter((p) => p.category === "books").length,
    merch: products.filter((p) => p.category === "merch").length,
    accessories: products.filter((p) => p.category === "accessories").length,
  };

  return (
    <div className="space-y-4">
      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-10 pl-9 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
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

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = category === cat.id;
          const count = counts[cat.id as keyof typeof counts];
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
              {Icon && <Icon className="size-3.5" />}
              {cat.label}
              <span className={`${isActive ? "text-white/70" : "text-slate-400"} text-[9px]`}>({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}