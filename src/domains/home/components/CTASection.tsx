"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-brand-bg-dark to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(14,124,123,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(27,58,92,0.08),transparent_50%)]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent border border-accent/20 mb-6">
          Get Started Today
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-white">
          Ready to Take Control of Your Finances?
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
          Whether you need tax preparation, bookkeeping, or strategic business
          advisory, our team is here to help you succeed.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/contact">
            <Button
              variant="accent"
              size="xl"
              className="gap-2.5 rounded-xl shadow-xl shadow-accent/25 hover:shadow-accent/35 transition-all duration-300 text-base"
            >
              <ArrowRight className="size-4" /> Get a Free Quote
            </Button>
          </Link>
          <Link href="https://www.accountdynamics.com/book-online" target="_blank" rel="noopener noreferrer">
            <Button
              size="xl"
              className="rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 gap-2.5 text-base shadow-lg"
            >
              <Phone className="size-4" /> Book a Consultation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
