"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import type { GalleryItem } from "@/domains/gallery/domain";

const aspectRatios = ["4/5", "1/1", "3/4", "16/9", "4/3", "9/16"];

export function MediaCard({
  item,
  index,
}: {
  item: GalleryItem;
  index: number;
}) {
  const ratio = aspectRatios[index % aspectRatios.length];
  const [blurDataUrl, setBlurDataUrl] = useState<string | null>((item as any).blurDataUrl || null);

  useEffect(() => {
    // only fetch small placeholder for lazy images
    if (index < 6) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/images/placeholder?src=${encodeURIComponent(item.src)}&w=20`);
        if (!res.ok) return;
        const j = await res.json();
        if (mounted && j?.dataUrl) setBlurDataUrl(j.dataUrl);
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false };
  }, [item.src, index]);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative w-full overflow-hidden rounded-xl break-inside-avoid focus:outline-none bg-slate-100 dark:bg-slate-800"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={item.src}
        alt={item.description || item.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        loading={index < 6 ? "eager" : "lazy"}
        quality={75}
        placeholder={blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={blurDataUrl || undefined}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {item.type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Play className="size-6 text-brand ml-0.5" />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <p className="text-sm font-bold text-white text-left leading-tight line-clamp-2">
          {item.title}
        </p>
      </div>
    </motion.button>
  );
}
