"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Quote, Award } from "lucide-react";
import { siteConfig } from "@/lib/site";

const fallbackImages = ["/team/president.jpg", "/team/vp.jpg", "/team/women.jpg"];

export function SuccessStories() {
  const [successStories, setSuccessStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/success-stories")
      .then((r) => r.json())
      .then((data) => { setSuccessStories(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Real People, Real Impact
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Meet the members whose lives have been transformed through {siteConfig.name}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group relative bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden hover:shadow-xl hover:shadow-brand/5 hover:border-brand/20 transition-all duration-500"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={fallbackImages[i] || story.image}
                  alt={story.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] bg-accent/90 text-black px-2.5 py-1 rounded-full">
                    <Award className="size-3" /> {story.achievement}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Quote className="size-5 text-brand/30 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{story.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {story.age && `${story.age} years old`}
                      {story.school ? ` - ${story.school}` : ""}
                      {story.university ? ` - ${story.university}` : ""}
                      {story.role ? ` - ${story.role}` : ""}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;{story.story}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
