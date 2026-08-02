"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import type { Product } from "@/domains/shop/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  product: Product
  index: number
  onAddToCart: (product: Product, variant?: string) => void
  onQuickView: (product: Product) => void
  onToggleWishlist: (product: Product) => void
  isWishlisted: boolean
}

export function ProductCard({ product, index, onAddToCart, onQuickView, onToggleWishlist, isWishlisted }: Props) {
  const [imgIndex, setImgIndex] = useState(0);

  const hasMultipleImages = product.images.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative"
    >
      <div className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
        {/* Image */}
        <Link href={`/shop/${product.slug}`} className="block relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <Image
            src={product.images[imgIndex] || "/shop/board.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.comparePrice && (
              <Badge variant="destructive" className="text-[9px] uppercase tracking-wider shadow-md">Sale</Badge>
            )}
            {product.featured && (
              <Badge variant="accent" className="text-[9px] uppercase tracking-wider shadow-md">Featured</Badge>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); onToggleWishlist(product) }}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 transition-all shadow-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300"
          >
            <Heart className={`size-3.5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-slate-600 dark:text-slate-300"}`} />
          </button>

          {/* Quick View */}
          <button
            onClick={(e) => { e.preventDefault(); onQuickView(product) }}
            className="absolute bottom-3 left-3 right-3 h-9 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          >
            <Eye className="size-3.5" /> Quick View
          </button>

          {/* Image dots */}
          {hasMultipleImages && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setImgIndex(i) }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="text-[9px] uppercase tracking-wider">{product.category}</Badge>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Star className="size-3 fill-accent text-accent" />
              <span className="font-medium">{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          </div>

          <Link href={`/shop/${product.slug}`}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {product.variants.map((v) => (
                <span key={v.id} className="inline-block rounded-md border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[9px] text-slate-500 dark:text-slate-400">
                  {v.value}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black text-brand">
                RWF {product.price.toLocaleString()}
              </span>
              {product.comparePrice && (
                <span className="text-[10px] text-slate-400 line-through">
                  RWF {product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>
            <Button
              variant="brand"
              size="sm"
              className="rounded-xl text-[10px] gap-1.5"
              onClick={() => onAddToCart(product)}
            >
              <ShoppingCart className="size-3.5" /> Add
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}