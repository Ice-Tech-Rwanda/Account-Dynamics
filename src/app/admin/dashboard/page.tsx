"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  CalendarCheck,
  Users,
  Star,
  HelpCircle,
  ArrowUpRight,
  Briefcase,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";

interface Stats {
  inquiries: { total: number; recent: number };
  quotes: { total: number; recent: number };
  consultations: { total: number; recent: number };
  subscribers: { total: number; recent: number };
  unreadNotifications: number;
  content: { services: number; teamMembers: number; testimonials: number };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Inquiries",
      value: stats?.inquiries.total ?? 0,
      recent: stats?.inquiries.recent ?? 0,
      icon: MessageSquare,
      href: "/admin/inquiries",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Quote Requests",
      value: stats?.quotes.total ?? 0,
      recent: stats?.quotes.recent ?? 0,
      icon: FileText,
      href: "/admin/quotes",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Consultations",
      value: stats?.consultations.total ?? 0,
      recent: stats?.consultations.recent ?? 0,
      icon: CalendarCheck,
      href: "/admin/consultations",
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Subscribers",
      value: stats?.subscribers.total ?? 0,
      recent: stats?.subscribers.recent ?? 0,
      icon: Users,
      href: "/admin/subscribers",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const contentCards = [
    { label: "Services", value: stats?.content.services ?? 0, icon: Briefcase, href: "/admin/services" },
    { label: "Team Members", value: stats?.content.teamMembers ?? 0, icon: Users, href: "/admin/team" },
    { label: "Testimonials", value: stats?.content.testimonials ?? 0, icon: Star, href: "/admin/testimonials" },
  ];

  return (
    <AdminPageShell title="Dashboard" subtitle="Welcome back! Here's your site overview.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-2xl border border-slate-200/80 bg-white p-5 dark:bg-slate-900 dark:border-slate-700/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} shadow-sm`}>
                  <Icon className="size-5 text-white" />
                </div>
                <ArrowUpRight className="size-4 text-slate-300 group-hover:text-brand transition-colors" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {loading ? "—" : card.value.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{card.label}</p>
              {card.recent > 0 && (
                <p className="text-[11px] font-bold text-emerald-600 mt-1">
                  +{card.recent} this month
                </p>
              )}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {contentCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 dark:bg-slate-900 dark:border-slate-700/50 hover:shadow-md transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <Icon className="size-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  {loading ? "—" : card.value}
                </p>
                <p className="text-xs font-medium text-slate-500">{card.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:bg-slate-900 dark:border-slate-700/50">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "View Inquiries", href: "/admin/inquiries" },
            { label: "Manage Services", href: "/admin/services" },
            { label: "Membership", href: "/admin/membership" },
            { label: "Edit Homepage", href: "/admin/homepage" },
            { label: "Upload Media", href: "/admin/media" },
            { label: "Site Settings", href: "/admin/settings" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="inline-flex items-center h-9 rounded-xl border border-slate-200/80 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-all"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
