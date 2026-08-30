"use client";

import { Brain, BarChart3, TrendingUp, Cpu } from "lucide-react";

const visionItems = [
  {
    icon: Cpu,
    title: "Digital Accounting Ecosystems",
    description:
      "Transforming traditional accounting practices into modern digital ecosystems that leverage technology for better outcomes.",
  },
  {
    icon: Brain,
    title: "Analytics-Driven Advisory",
    description:
      "Applying business analytics to accounting to help clients understand performance, identify opportunities and plan ahead with confidence.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Advisory",
    description:
      "Providing relevant and cost-effective advisory services to small businesses in a rapidly changing and complex business environment.",
  },
  {
    icon: TrendingUp,
    title: "Innovation & Growth",
    description:
      "Embracing technological adoption and exploring new business opportunities to remain at the forefront of tax, accounting and business advisory.",
  },
];

export function VisionSection() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent mb-4">
            Our Vision
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Building the Future of Digital Accounting
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Our vision involves transforming traditional accounting practices
            into digital accounting ecosystems, integrating technology and
            analytics to deliver exceptional service.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visionItems.map((item) => (
            <div
              key={item.title}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-brand/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-accent/5 dark:bg-accent/10 text-accent mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="size-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
