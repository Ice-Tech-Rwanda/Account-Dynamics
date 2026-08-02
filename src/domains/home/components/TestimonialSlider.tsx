"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { siteConfig } from "@/lib/site";

const testimonials = [
  {
    quote: `${siteConfig.name} has transformed my vocabulary and strategic thinking. The weekly meetups are the highlight of my week, and the community is incredibly welcoming.`,
    author: "Jean Pierre",
    role: "Club Member since 2023",
    rating: 5,
    initials: "JP",
  },
  {
    quote: "The school outreach program has introduced Scrabble to over 500 students in Kigali. It's incredible to see young minds fall in love with words and strategy.",
    author: "Grace Uwimana",
    role: "School Program Coordinator",
    rating: 5,
    initials: "GU",
  },
  {
    quote: `Competing in ${siteConfig.name} tournaments sharpened my skills tremendously. The community is welcoming and the competition is fierce — exactly what every player needs to grow.`,
    author: "David Mugisha",
    role: "Tournament Player, Ranked #2",
    rating: 5,
    initials: "DM",
  },
  {
    quote: "As a beginner, I was nervous to join. But the mentorship program helped me go from 0 to competitive in just 3 months. Now I can't imagine my week without Scrabble.",
    author: "Alice Habimana",
    role: "New Member, Class of 2024",
    rating: 5,
    initials: "AH",
  },
  {
    quote: `The resources ${siteConfig.name} provides — from word lists to strategy guides — are world-class. Proud to be part of this community that's putting Rwandan Scrabble on the map.`,
    author: "Patrick Niyonzima",
    role: "Competitive Scrabble Player",
    rating: 5,
    initials: "PN",
  },
];

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-accent/5 dark:from-brand/10 dark:via-transparent dark:to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.04),transparent_60%)]" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="it-kicker dark:it-kicker-dark">Testimonials</span>
          <h2 className="it-title dark:it-title-dark">
            What Members Say
          </h2>
        </motion.div>

        <div className="relative mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="relative rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 sm:p-12 shadow-xl mx-2 sm:mx-8">
                <Quote className="size-8 sm:size-10 text-accent/20 dark:text-accent/10 absolute top-6 left-6 sm:top-8 sm:left-8" />

                <div className="flex items-center justify-center gap-1.5 mb-6">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-accent text-accent" />
                  ))}
                </div>

                <blockquote className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed italic font-medium max-w-2xl mx-auto">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand to-emerald-600 text-sm font-bold text-white shadow-lg">
                    {testimonials[current].initials}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {testimonials[current].author}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-brand hover:border-brand/30 transition-all shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-500 ${
                    i === current
                      ? "w-8 h-2.5 bg-brand dark:bg-accent shadow-sm"
                      : "w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-brand hover:border-brand/30 transition-all shadow-sm hover:shadow-md"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
