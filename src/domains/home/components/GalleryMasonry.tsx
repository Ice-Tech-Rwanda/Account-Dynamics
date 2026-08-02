"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Play } from "lucide-react";

export interface GalleryItem {
  id: string
  src: string
  title: string
  description?: string
  category?: string
  type?: string
}

const layouts = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

const aspectRatios = [
  "aspect-[4/5] md:aspect-[3/4]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[16/9] md:aspect-[2/1]",
  "aspect-square",
];

export function GalleryMasonry({ items }: { items: GalleryItem[] }) {
  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-slate-50/80 dark:bg-slate-950/50" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-4"
        >
          <div>
            <span className="it-kicker dark:it-kicker-dark">Gallery</span>
            <h2 className="it-title dark:it-title-dark">
              Club Moments
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:text-brand-soft transition-colors group"
          >
            View Gallery <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="it-copy dark:it-copy-dark max-w-2xl mb-10"
        >
          Highlights from tournaments, meetups, and outreach programs.
        </motion.p>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="size-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No gallery images yet.</p>
            <p className="text-sm text-slate-400 mt-1">Photos will appear here after our next event.</p>
          </div>
        ) : (
          <>
          {items.length < 6 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-square"
                >
                  <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <Image
                      src={item.src || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-xs sm:text-sm font-bold text-white drop-shadow-lg">{item.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-auto">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${layouts[i] || "md:col-span-1 md:row-span-1"}`}
            >
              <div className={`${aspectRatios[i] || "aspect-square"} relative bg-slate-100 dark:bg-slate-800 overflow-hidden`}>
                <Image
                  src={item.src || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                      <Play className="size-5 text-slate-900 ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xs sm:text-sm font-bold text-white drop-shadow-lg">
                    {item.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-white/70 mt-0.5 line-clamp-1 drop-shadow">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-bold uppercase tracking-wider text-accent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Camera className="size-2.5" /> {item.category?.replace("-", " ")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
          )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center sm:hidden"
        >
          <Link href="/gallery">
            <Button variant="brand" className="rounded-xl gap-2 shadow-lg shadow-brand/20">
              View Gallery <ArrowRight className="size-4" />
            </Button>
          </Link>
        </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
