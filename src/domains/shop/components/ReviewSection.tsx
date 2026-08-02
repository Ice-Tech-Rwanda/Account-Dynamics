"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, MessageSquare, User } from "lucide-react";
import type { ProductReview } from "@/domains/shop/domain";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  reviews: ProductReview[]
  rating: number
  reviewCount: number
}

export function ReviewSection({ reviews, rating, reviewCount }: Props) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Reviews</span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Customer Reviews
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={`size-3.5 ${i < Math.round(rating) ? "fill-accent text-accent" : "text-slate-200 dark:text-slate-700"}`} />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">{rating}</span>
          <span className="text-xs text-slate-400">({reviewCount})</span>
        </div>
      </motion.div>

      <div className="space-y-4">
        {visible.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <User className="size-3.5 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{review.author}</p>
                    {review.verified && (
                      <Badge variant="outline" className="text-[8px] text-brand border-brand/20">Verified</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star key={j} className={`size-2.5 ${j < review.rating ? "fill-accent text-accent" : "text-slate-200 dark:text-slate-700"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400">{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{review.text}</p>
            <button className="mt-2 inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors">
              <ThumbsUp className="size-3" /> Helpful
            </button>
          </motion.div>
        ))}
      </div>

      {reviews.length > 3 && !showAll && (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-4 text-center">
          <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5" onClick={() => setShowAll(true)}>
            <MessageSquare className="size-3.5" /> View All {reviews.length} Reviews
          </Button>
        </motion.div>
      )}
    </div>
  );
}