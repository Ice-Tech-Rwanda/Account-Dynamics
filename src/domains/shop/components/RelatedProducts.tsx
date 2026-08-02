"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/domains/shop/domain";
import { Badge } from "@/components/ui/badge";

interface Props {
  current: Product
  products: Product[]
  onAddToCart: (product: Product) => void
}

export function RelatedProducts({ current, products, onAddToCart }: Props) {
  const related = products
    .filter((p) => p.id !== current.id && p.category === current.category)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Related</span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1">
            You Might Also Like
          </h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {related.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group"
          >
            <Link href={`/shop/${product.slug}`} className="block">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2">
                <Image
                  src={product.images[0] || "/shop/board.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {product.comparePrice && (
                  <Badge variant="destructive" className="absolute top-2 left-2 text-[8px]">Sale</Badge>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-1 text-[9px] text-slate-400 mb-0.5">
              <Star className="size-2.5 fill-accent text-accent" />
              <span className="font-medium">{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
            <Link href={`/shop/${product.slug}`}>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-black text-brand">RWF {product.price.toLocaleString()}</span>
              <button
                onClick={() => onAddToCart(product)}
                className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-brand hover:bg-brand hover:text-white transition-all"
              >
                <ShoppingCart className="size-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}