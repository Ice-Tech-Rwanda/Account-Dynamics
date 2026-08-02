"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Users, Trophy, BookOpen, Building2, Target, Handshake, Newspaper, Award, BarChart3, FileText, Download, Video, Package, Tag, ShoppingBag, Truck, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Trophy,
  BookOpen,
  Building2,
  Target,
  Handshake,
  Newspaper,
  Award,
  BarChart3,
  FileText,
  Download,
  Video,
  Package,
  Tag,
  ShoppingBag,
  Truck,
};

interface StatCounterProps {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
  dark?: boolean;
}

export function StatCounter({
  label,
  value,
  suffix = "",
  icon,
  dark,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);
  const Icon = iconMap[icon] || Users;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center p-6 rounded-2xl transition-all duration-300",
        dark
          ? "bg-white/5 border border-white/10"
          : "bg-white border border-slate-200/80 shadow-sm hover:shadow-md"
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl mb-3",
          dark ? "bg-accent/20 text-accent" : "bg-brand/10 text-brand"
        )}
      >
        <Icon className="size-6" />
      </div>
      <span
        className={cn(
          "text-3xl font-black tracking-tight",
          dark ? "text-white" : "text-slate-900"
        )}
      >
        {count}
        {suffix}
      </span>
      <span
        className={cn(
          "text-xs font-medium uppercase tracking-[0.12em] mt-1",
          dark ? "text-slate-400" : "text-slate-500"
        )}
      >
        {label}
      </span>
    </div>
  );
}
