"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { siteConfig } from "@/lib/site";

const galleryImages = [
  { src: "/gallery/open-2025.jpg", album: "Rwanda Open 2025" },
  { src: "/gallery/school-outreach.jpg", album: "School Outreach" },
  { src: "/gallery/university-finals.jpg", album: "University Finals" },
  { src: "/gallery/training.jpg", album: "Training Session" },
  { src: "/gallery/extra-1.jpg", album: "Community Events" },
  { src: "/team/president.jpg", album: "Team & Leadership" },
  { src: "/team/vp.jpg", album: "Team & Leadership" },
  { src: "/team/women.jpg", album: "Women in Scrabble" },
  { src: "/team/coach.jpg", album: "Coaching Team" },
];

export function PhotoGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1);
  };

  return (
    <section id="impact-gallery" className="py-20 sm:py-28 bg-brand-bg dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">
            Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Moments That Matter
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            A glimpse into the events, people, and programs that define {siteConfig.name}
          </p>
        </motion.div>

        <div className="columns-2 sm:columns-3 gap-4 space-y-4">
          {galleryImages.map((img, i) => (
            <motion.button
              key={`${img.src}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedIndex(i)}
              className="group relative w-full overflow-hidden rounded-xl break-inside-avoid focus:outline-none"
            >
              <div className="relative w-full" style={{ aspectRatio: i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "3/4" }}>
                <Image
                  src={img.src}
                  alt={img.album}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="size-8 text-white drop-shadow-lg" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            onClick={() => setSelectedIndex(null)}
          >
            <X className="size-8" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          >
            <ChevronLeft className="size-10" />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
          >
            <ChevronRight className="size-10" />
          </button>

          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[selectedIndex].src}
              alt={galleryImages[selectedIndex].album}
              fill
              className="object-contain"
            />
          </motion.div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {selectedIndex + 1} / {galleryImages.length}
          </div>
        </motion.div>
      )}
    </section>
  );
}
