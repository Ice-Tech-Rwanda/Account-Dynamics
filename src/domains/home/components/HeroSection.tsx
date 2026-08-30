"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { siteImages } from "@/lib/siteImages";

const SLIDES = siteImages.heroSlides;

const SLIDE_DURATION_MS = 6000;

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduceMotion || paused) return;
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [index, paused, reduceMotion]);

  function goTo(slide: number) {
    setIndex(((slide % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-bg-dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Introduction"
    >
      {/* Sliding background images */}
      <div className="absolute inset-0">
        {SLIDES.map((slide, slideIndex) => (
          <motion.div
            key={slide.src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: slideIndex === index ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.2, ease: "easeInOut" }}
            aria-hidden={slideIndex !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={slideIndex === 0}
              sizes="100vw"
              className="object-cover"
              style={
                slideIndex === index && !reduceMotion
                  ? { transform: "scale(1.08)", transition: "transform 7s ease-out" }
                  : { transform: "scale(1)", transition: "transform 7s ease-out" }
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-bg-dark/70 via-brand-bg-dark/50 to-brand-bg-dark/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(29,42,32,0.4),transparent_60%)]" />

      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 py-24">
        <div className="text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex justify-center sm:justify-start"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-xl px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-soft border border-accent-soft/30">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              Helping You Reach Your Financial Goals
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-white"
          >
            Turn your numbers into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-soft via-accent to-accent-soft">
              smarter decisions.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-slate-200/90 max-w-2xl leading-relaxed font-light"
          >
            Professional tax, cloud accounting, bookkeeping and advisory for
            individuals and small businesses across Canada.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-9 flex flex-wrap gap-4 justify-center sm:justify-start"
          >
            <Link href="/book">
              <Button variant="accent" size="xl" className="gap-2.5 rounded-xl shadow-xl shadow-accent/30 text-base">
                Book a Free Consultation
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href={siteConfig.bookOnlineUrl}>
              <Button
                size="xl"
                className="rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-white/30 gap-2.5 text-base shadow-lg"
              >
                <Phone className="size-4" /> Book a Consultation
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute z-20 right-5 bottom-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous slide"
          className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white p-2.5 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next slide"
          className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white p-2.5 hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-7 flex items-center gap-2">
        {SLIDES.map((slide, slideIndex) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goTo(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
            aria-current={slideIndex === index}
            className={`h-2 rounded-full transition-all duration-300 ${
              slideIndex === index
                ? "w-8 bg-accent"
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}