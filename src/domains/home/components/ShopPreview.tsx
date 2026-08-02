"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, ShoppingBag, ChevronLeft, ChevronRight, Star, Package } from "lucide-react";

export interface ShopProduct {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  rating?: number
}

export function ShopPreview({ products }: { products: ShopProduct[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(13,122,62,0.02),transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-4"
        >
          <div>
            <span className="it-kicker">Shop</span>
            <h2 className="it-title">Club Merchandise</h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:text-brand-soft transition-colors group"
          >
            Browse All <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="it-copy max-w-2xl mb-10"
        >
          Rep the club with official gear — boards, books, and branded apparel.
        </motion.p>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="size-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Shop coming soon.</p>
            <p className="text-sm text-slate-400 mt-1">We&apos;re preparing our merchandise collection.</p>
          </div>
        ) : (
          <div className="relative">
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-slate-600 hover:text-brand transition-all -ml-5"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}

            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="flex-shrink-0 w-[260px] sm:w-[280px] snap-start"
                >
                  <Link href={`/shop/${product.slug}`} className="group block">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-square relative bg-slate-100 overflow-hidden">
                        <Image
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="280px"
                        />
                        {product.comparePrice && (
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center rounded-lg bg-red-500/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-white">SALE</span>
                          </div>
                        )}
                        {product.rating && (
                          <div className="absolute top-3 right-3">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-slate-700 shadow-sm">
                              <Star className="size-2.5 fill-accent text-accent" /> {product.rating}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                          <span className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-xl px-4 py-2 text-[11px] font-bold text-slate-900 shadow-xl">
                            <Search className="size-3" /> Quick View
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="mt-0.5 text-[10px] text-slate-500 uppercase tracking-wider font-medium">{product.category}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-brand">
                              RWF {product.price.toLocaleString()}
                            </span>
                            {product.comparePrice && (
                              <span className="text-[10px] text-slate-400 line-through">RWF {product.comparePrice.toLocaleString()}</span>
                            )}
                          </div>
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                            <ShoppingBag className="size-3" /> Buy
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-slate-600 hover:text-brand transition-all -mr-5"
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center sm:hidden"
        >
          <Link href="/shop">
            <Button variant="brand" className="rounded-xl gap-2">
              Browse All <ArrowRight className="size-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
