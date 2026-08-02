"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { GalleryItem } from "@/domains/gallery/domain";

export function LightboxViewer({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        <button
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-20 p-2"
          onClick={onClose}
          aria-label="Close viewer"
        >
          <X className="size-7" />
        </button>

        <button
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-20 p-2"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <ChevronLeft className="size-8 sm:size-10" />
        </button>

        <button
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-20 p-2"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <ChevronRight className="size-8 sm:size-10" />
        </button>

        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-5xl w-full h-full max-h-[85vh] flex flex-col items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          onClick={(e) => e.stopPropagation()}
        >
          {item.type === "video" && item.videoUrl ? (
            <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden">
              <iframe
                src={item.videoUrl}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="relative w-full h-full max-h-[75vh]">
              <Image
                src={item.src}
                alt={item.description || item.title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 60vw"
              />
              <div className="sr-only" id={`lightbox-caption-${item.id}`}>{item.description || item.title}</div>
            </div>
          )}

          <div className="mt-5 text-center max-w-2xl">
            <h3 className="text-white text-lg font-bold">{item.title}</h3>
            {item.description && (
              <p className="text-white/60 text-sm mt-1 line-clamp-2" id={`lightbox-desc-${item.id}`}>{item.description}</p>
            )}
            <div className="flex items-center justify-center gap-3 mt-3">
              {item.type === "video" && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                  <Play className="size-3" /> Video
                </span>
              )}
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/40">
                {currentIndex + 1} / {items.length}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
