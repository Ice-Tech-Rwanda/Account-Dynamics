"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Users, Calendar, ShoppingBag, Heart, ArrowUpRight, Activity } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface MonthlyDatum {
  month: string;
  members: number;
  events: number;
  revenue: number;
}

interface ActivityEntry {
  action: string;
  detail: string;
  time: string;
  type: string;
}

interface DashboardData {
  stats: {
    totalMembers: number;
    upcomingEvents: number;
    productsSold: number;
    totalDonations: number;
  };
  recentMembers: { name: string; email: string; date: string }[];
  recentDonations: { name: string; amount: number; date: string }[];
  monthlyData: MonthlyDatum[];
  activities: ActivityEntry[];
}

const activityIcons: Record<string, React.ElementType> = {
  member: Users, donation: Heart, event: Calendar, order: ShoppingBag, gallery: Activity, ranking: TrendingUp,
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-bold text-slate-900 dark:text-white mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboardClient({ data }: { data: DashboardData | null }) {
  const statCards = [
    { label: "Total Members", value: data?.stats.totalMembers ?? 0, change: "+12%", trend: "up", icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "Upcoming Events", value: data?.stats.upcomingEvents ?? 0, change: "+3", trend: "up", icon: Calendar, color: "from-emerald-500 to-brand" },
    { label: "Products", value: data?.stats.productsSold ?? 0, change: "8 in catalog", trend: "neutral", icon: ShoppingBag, color: "from-amber-500 to-accent" },
    { label: "Donations", value: data?.stats.totalDonations ?? 0, change: "+18%", trend: "up", icon: Heart, color: "from-red-500 to-rose-600" },
  ];

  const formatCurrency = (val: number) =>
    val >= 1000000
      ? `${(val / 1000000).toFixed(1)}M`
      : val >= 1000
        ? `${(val / 1000).toFixed(0)}K`
        : val.toString();

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Welcome back! Here&apos;s your club overview.</p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:bg-slate-900 dark:border-slate-700/50 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-sm`}>
                  <Icon className="size-5 text-white" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-bold ${
                  stat.trend === "up" ? "text-emerald-600" : stat.trend === "down" ? "text-red-500" : "text-slate-400"
                }`}>
                  {stat.trend === "up" && <ArrowUpRight className="size-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {stat.label === "Donations" ? `FRW ${formatCurrency(stat.value)}` : typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <motion.div variants={item} className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 dark:bg-slate-900 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Revenue Overview</h2>
              <p className="text-xs text-slate-500">Monthly donation &amp; sales revenue</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="size-3.5" /> +24%
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyData ?? []}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="var(--brand)" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:bg-slate-900 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Metrics</h2>
              <p className="text-xs text-slate-500">Members &amp; events</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthlyData ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="members" fill="var(--brand)" radius={[4, 4, 0, 0]} name="Members" />
                <Bar dataKey="events" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Events" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={item} className="rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-700/50">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Members</h2>
            <Link href="/admin/members" className="text-xs font-bold text-brand hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {(data?.recentMembers?.length ?? 0) === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">No members yet.</p>
            ) : (
              data?.recentMembers.slice(0, 5).map((member) => (
                <div key={member.email} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand text-xs font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">{new Date(member.date).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-700/50">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Activity Log</h2>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-[9px] font-bold text-brand">{data?.activities?.length ?? 0}</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {(data?.activities ?? []).map((a, i) => {
              const Icon = activityIcons[a.type] || Activity;
              return (
                <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <Icon className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{a.action}</p>
                    <p className="text-xs text-slate-500">{a.detail}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="mt-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "New Event", href: "/admin/events" },
            { label: "Add Member", href: "/admin/members" },
            { label: "Update Rankings", href: "/admin/rankings" },
            { label: "New Product", href: "/admin/shop" },
            { label: "Add Gallery", href: "/admin/gallery" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="inline-flex items-center gap-1 h-9 rounded-xl border border-slate-200/80 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-all"
            >
              + {action.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
