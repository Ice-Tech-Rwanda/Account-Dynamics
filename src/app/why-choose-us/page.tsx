"use client";

import { motion } from "framer-motion";
import {
  Award,
  Users,
  Cloud,
  ShieldCheck,
  BarChart3,
  Wallet,
  Cpu,
  TrendingUp,
} from "lucide-react";
import { CTASection } from "@/domains/home/components/CTASection";

const pillars = [
  {
    icon: Award,
    title: "Professional Expertise",
    description:
      "Experienced accounting and tax professionals with decades of combined experience in Canadian tax law, corporate accounting and business advisory.",
  },
  {
    icon: Users,
    title: "Personalized Service",
    description:
      "Solutions designed around each client's unique business and financial situation. We take the time to understand your specific needs and goals.",
  },
  {
    icon: Cloud,
    title: "Technology-Enabled Accounting",
    description:
      "Modern cloud-based and paperless accounting workflows that give you real-time access to your financial information from anywhere.",
  },
  {
    icon: ShieldCheck,
    title: "Tax & Compliance Knowledge",
    description:
      "Comprehensive support with tax preparation, planning, compliance and CRA-related matters to keep you on the right side of regulations.",
  },
  {
    icon: BarChart3,
    title: "Business Insight",
    description:
      "Financial data is used not merely for record keeping but to help clients understand their businesses, identify opportunities and make informed decisions.",
  },
  {
    icon: Wallet,
    title: "Cost-Conscious Advisory",
    description:
      "Practical and cost-effective advisory support designed for entrepreneurs and small businesses who need quality service without excessive fees.",
  },
  {
    icon: Cpu,
    title: "Digital Transformation",
    description:
      "Forward-thinking approach to integrating AI technology and business analytics into accounting practices for future predictive models.",
  },
  {
    icon: TrendingUp,
    title: "Growth Partnership",
    description:
      "We grow with our clients, providing scalable services that adapt as your business evolves and your needs change over time.",
  },
];

export default function WhyChooseUsPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-br from-slate-950 via-brand-bg-dark to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(14,124,123,0.08),transparent_50%)]" />
        <div className="relative z-10 it-container px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent border border-accent/20 mb-6">
              Why Choose Us
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-white"
          >
            Why Clients Trust
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-teal-300 to-accent-soft">
              Account Dynamics
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            We combine professional expertise with personalized service and
            modern technology to deliver results that matter for your business.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none" />
      </section>

      {/* Pillars */}
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
        <div className="it-container px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-brand/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand/5 dark:bg-brand/10 text-brand mb-4 group-hover:scale-110 transition-transform">
                  <pillar.icon className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
