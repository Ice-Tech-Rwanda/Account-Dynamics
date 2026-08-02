"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { Product } from "@/domains/shop/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product, variant?: string) => void
  onToggleWishlist: (product: Product) => void
  isWishlisted: boolean
}

export function QuickViewModal({ product, onClose, onAddToCart, onToggleWishlist, isWishlisted }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [added, setAdded] = useState(false);
  const [prevProductId, setPrevProductId] = useState<string | null>(product?.id ?? null);

  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id);
    setImgIndex(0);
    setSelectedVariant("");
    setAdded(false);
  }

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = "" };
  }, [product]);

  const handleAdd = () => {
    onAddToCart(product!, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="size-3.5" />
          </button>

          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
              <Image src={product.images[imgIndex] || "/shop/board.jpg"} alt={product.name} fill className="object-cover" sizes="400px" />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex((i) => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 transition-all shadow"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setImgIndex((i) => (i + 1) % product.images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 transition-all shadow"
                  >
                    <ChevronRight className="size-3.5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"}`}
                  />
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="p-5 sm:p-6 flex flex-col">
              <Badge variant="outline" className="text-[9px] uppercase tracking-wider self-start mb-2">{product.category}</Badge>

              <h2 className="text-lg font-black text-slate-900 dark:text-white">{product.name}</h2>

              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`size-3 ${i < Math.round(product.rating) ? "fill-accent text-accent" : "text-slate-200 dark:text-slate-700"}`} />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">{product.rating} ({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-xl font-black text-brand">RWF {product.price.toLocaleString()}</span>
                {product.comparePrice && (
                  <span className="text-xs text-slate-400 line-through">RWF {product.comparePrice.toLocaleString()}</span>
                )}
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{product.description}</p>

              {/* Variants */}
              {product.variants && (
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">{product.variants[0].label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.value)}
                        className={`rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all ${
                          selectedVariant === v.value
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {v.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              {product.details && (
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Details</p>
                  <ul className="space-y-1">
                    {product.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <Check className="size-3 text-brand mt-0.5 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto pt-4 flex flex-col gap-2">
                <Button onClick={handleAdd} variant="brand" className="w-full rounded-xl gap-2 h-10 text-xs">
                  {added ? (
                    <><Check className="size-4" /> Added to Cart</>
                  ) : (
                    <><ShoppingCart className="size-4" /> Add to Cart — RWF {product.price.toLocaleString()}</>
                  )}
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl text-xs gap-1.5"
                    onClick={() => onToggleWishlist(product)}
                  >
                    <Heart className={`size-3.5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                    {isWishlisted ? "Wishlisted" : "Wishlist"}
                  </Button>
                  <Link href={`/shop/${product.slug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full rounded-xl text-xs gap-1.5">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}