"use client";

import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { MediaCard } from "./MediaCard";
import type { GalleryItem } from "@/domains/gallery/domain";

export function GalleryMasonry({
  items,
}: {
  items: GalleryItem[];
}) {
  const columns = useMemo(() => {
    const colCount = 3;
    const cols: GalleryItem[][] = Array.from({ length: colCount }, () => []);
    items.forEach((item, i) => {
      cols[i % colCount].push(item);
    });
    return cols;
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">No media found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {columns.map((col, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {col.map((item, _itemIndex) => {
              const globalIndex = items.indexOf(item);
              return (
                <MediaCard
                  key={item.id}
                  item={item}
                  index={globalIndex}
                />
              );
            })}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
