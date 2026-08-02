"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Trophy, Award, TrendingUp, Zap, Activity, Shield, GraduationCap, Calendar, Star, MapPin } from "lucide-react";
import type { PlayerProfile } from "@/domains/rankings/domain";

import { formatDate } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect } from "react";

const iconMap: Record<string, React.ElementType> = {
  Trophy, Award, TrendingUp, Zap, Activity, Shield, GraduationCap, Star,
};

interface Props {
  profile: PlayerProfile | null;
  onClose: () => void;
}

export function PlayerProfileModal({ profile, onClose }: Props) {
  useEffect(() => {
    if (profile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = "" };
  }, [profile]);

  if (!profile) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm px-4 py-8"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="size-3.5" />
          </button>

          {/* Header */}
          <div className="relative h-36 sm:h-44">
            <Image src="/events/open.jpg" alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative px-5 sm:px-6 pb-6">
            {/* Avatar + basic info */}
            <div className="flex flex-wrap items-end gap-4 -mt-14 sm:-mt-16 mb-5">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-800 shadow-lg">
                <Image src={profile.avatar || "/team/placeholder.jpg"} alt={profile.name} fill className="object-cover" sizes="96px" loading="eager" />
              </div>
              <div className="flex-1 pt-10 sm:pt-12">
                <h2 className="text-lg sm:text-xl font-black text-white drop-shadow-sm">{profile.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-xs font-medium text-accent">{profile.title}</span>
                  <span className="text-slate-400">·</span>
                  <span className="flex items-center gap-1 text-xs text-slate-300"><MapPin className="size-3" /> {profile.region}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Rating", value: profile.rating, color: "text-accent" },
                { label: "Rank", value: `#${profile.rank}`, color: "text-brand" },
                { label: "Win Rate", value: `${profile.winRate}%`, color: "text-blue-500" },
                { label: "Tournaments", value: profile.totalTournaments, color: "text-purple-500" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <p className={`text-lg sm:text-xl font-black ${stat.color} mt-0.5`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left */}
              <div className="space-y-6">
                {/* Career Stats */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Career Stats</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: "Games Played", value: profile.gamesPlayed },
                      { label: "Wins", value: profile.wins },
                      { label: "Losses", value: profile.losses },
                      { label: "Best Word", value: profile.bestWord, highlight: true },
                      { label: "Best Score", value: profile.bestScore },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-[11px] text-slate-500">{s.label}</span>
                        <span className={`text-xs font-bold ${s.highlight ? "text-accent" : "text-slate-900 dark:text-white"}`}>
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Titles */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Titles</h3>
                  <div className="space-y-2">
                    {profile.titles.map((title, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg border border-accent/10 bg-gradient-to-r from-accent/5 to-transparent px-3 py-2">
                        <Trophy className="size-3.5 text-accent flex-shrink-0" />
                        <span className="text-xs font-medium text-slate-900 dark:text-white">{title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Achievements</h3>
                  <div className="grid gap-2">
                    {profile.achievements.map((a) => {
                      const Icon = iconMap[a.icon] || Award;
                      return (
                        <div key={a.id} className="flex items-center gap-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 px-3 py-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10">
                            <Icon className="size-3.5 text-brand" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-900 dark:text-white">{a.title}</p>
                            <p className="text-[10px] text-slate-400">{formatDate(a.date)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-6">
                {/* Rating History Chart */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Rating History</h3>
                  <div className="rounded-xl border border-slate-200/60 dark:border-slate-800 p-3">
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={profile.ratingHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                        <XAxis dataKey="month" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} className="text-slate-400" />
                        <YAxis hide domain={["dataMin - 30", "dataMax + 30"]} />
                        <Tooltip
                          contentStyle={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", fontSize: 11 }}
                          labelClassName="font-bold text-slate-900"
                        />
                        <Line type="monotone" dataKey="rating" stroke="var(--accent)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Tournament History */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Tournament History</h3>
                  <div className="space-y-2">
                    {profile.tournamentHistory.map((t) => (
                      <div key={t.id} className="flex items-center justify-between rounded-lg border border-slate-200/60 dark:border-slate-800 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{t.tournamentName}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Calendar className="size-2.5" /> {formatDate(t.date)}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <span className={`inline-flex items-center justify-center h-5 min-w-[1.25rem] rounded text-[10px] font-bold ${
                            t.position === 1 ? "bg-accent/15 text-accent" :
                            t.position <= 3 ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300" :
                            "bg-slate-100 dark:bg-slate-800 text-slate-400"
                          }`}>
                            #{t.position}
                          </span>
                          {t.prize && <p className="text-[10px] text-accent font-medium mt-0.5">{t.prize}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}