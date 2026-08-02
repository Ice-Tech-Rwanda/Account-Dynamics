"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Calendar, BookOpen } from "lucide-react";
import { siteConfig } from "@/lib/site";

const slides = [
  { src: "/hero/slide-1.jpg", alt: "Community tournament", fallback: "/events/open.jpg" },
  { src: "/hero/slide-2.jpg", alt: "Students during an outreach session", fallback: "/gallery/school-outreach.jpg" },
  { src: "/hero/slide-3.jpg", alt: "Competition underway", fallback: "/events/weekly.jpg" },
  { src: "/hero/slide-4.jpg", alt: "Players at a match", fallback: "/gallery/university-finals.jpg" },
  { src: "/gallery/training.jpg", alt: "Training session", fallback: "/events/workshop.jpg" },
  { src: "/gallery/open-2025.jpg", alt: "Championship winners", fallback: "/events/monthly.jpg" },
];

function preloadImages() {
  slides.forEach((slide) => {
    const img = new window.Image();
    img.src = slide.src;
    if (slide.fallback) {
      const fallbackImg = new window.Image();
      fallbackImg.src = slide.fallback;
    }
  });
}

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const preloaded = useRef(false);

  useEffect(() => {
    if (!preloaded.current) {
      preloadImages();
      preloaded.current = true;
    }
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "30%" : "-30%", opacity: 0, scale: 1.08 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-30%" : "30%", opacity: 0, scale: 0.92 }),
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen flex items-end lg:items-center justify-center overflow-hidden bg-slate-950">
      <AnimatePresence custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].src}
            alt={slides[current].alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onError={(e) => {
              const target = e.currentTarget;
              const fallback = slides[current].fallback;
              if (fallback && !target.dataset.fallback) {
                target.dataset.fallback = "true";
                target.src = fallback;
              }
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 via-55% to-slate-950/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(13,122,62,0.06),transparent_60%)]" />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`transition-all duration-700 rounded-full ${
              i === current
                ? "w-10 h-2 bg-accent shadow-lg shadow-accent/30"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pb-16 lg:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent border border-accent/20 mb-6 shadow-lg">
            <Sparkles className="size-3" /> {siteConfig.name}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-black leading-[1.04] tracking-[-0.04em] text-white"
        >
          Building Community,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-300 to-accent-soft">
            One Match at a Time
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-5 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
        >
          {siteConfig.name} brings people together through friendly competition,
          skill-building, and community outreach — join us for tournaments,
          training sessions, and programs that make a difference.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link href="/join">
            <Button variant="accent" size="xl" className="gap-2.5 rounded-xl shadow-xl shadow-accent/30 text-base">
              <Users className="size-4" /> Join Our Community
            </Button>
          </Link>
          <Link href="/events">
            <Button size="xl" className="rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-white/30 gap-2.5 text-base shadow-lg">
              <Calendar className="size-4" /> Upcoming Events
            </Button>
          </Link>
          <Link href="/resources">
            <Button size="xl" className="rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-white/30 gap-2.5 text-base shadow-lg">
              <BookOpen className="size-4" /> Learn Scrabble
            </Button>
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950/30 to-transparent pointer-events-none" />
    </section>
  );
}
