"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Medal, Trophy, Crown, TrendingUp, Users, BarChart3 } from "lucide-react";
import type { Ranking, PlayerProfile } from "@/domains/rankings/domain";
import { Badge } from "@/components/ui/badge";
import { RankingsHero } from "@/domains/rankings/components/RankingsHero";
import { Leaderboard } from "@/domains/rankings/components/Leaderboard";
import { RankingHistoryChart } from "@/domains/rankings/components/RankingHistoryChart";
import { TournamentTable } from "@/domains/rankings/components/TournamentTable";

const medalConfig = [
  { color: "text-yellow-400", bg: "bg-gradient-to-b from-yellow-50 to-transparent dark:from-yellow-500/10", border: "border-yellow-400/30", shadow: "shadow-yellow-400/10", label: "Gold", icon: Crown },
  { color: "text-slate-300", bg: "bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-300/10", border: "border-slate-300/30", shadow: "shadow-slate-300/10", label: "Silver", icon: Trophy },
  { color: "text-amber-600", bg: "bg-gradient-to-b from-amber-50 to-transparent dark:from-amber-600/10", border: "border-amber-600/30", shadow: "shadow-amber-600/10", label: "Bronze", icon: Medal },
];

export default function RankingsContent({
  rankings,
  playerProfiles,
}: {
  rankings: Ranking[];
  playerProfiles: PlayerProfile[];
}) {
  const top3 = rankings.filter((r) => r.rank <= 3);

  return (
    <div className="overflow-x-hidden">
      <RankingsHero />

      {/* Podium */}
      <section className="py-20 sm:py-28 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Leaderboard</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Top Players
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Our club&apos;s highest-rated players based on tournament performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl mx-auto items-end mb-16">
            {top3.map((player, i) => {
              const config = medalConfig[i];
              const Icon = config.icon;
              const heightClass = i === 0 ? "pt-8 sm:pt-12" : i === 1 ? "pt-4 sm:pt-6" : "pt-2 sm:pt-3";
              return (
                <motion.a
                  key={player.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  href={`/players/${player.playerId}`}
                  className={`group block relative rounded-2xl border-2 ${config.border} ${config.bg} ${heightClass} p-4 sm:p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${config.shadow}`}
                >
                  {/* Medal icon */}
                  <div className={`mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full ${i === 0 ? "bg-yellow-400/15" : "bg-slate-100 dark:bg-slate-800"} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`size-5 sm:size-6 ${config.color}`} />
                  </div>

                  {/* Avatar */}
                  <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 bg-slate-200 dark:bg-slate-700 mb-3">
                    <Image src={player.avatar || "/team/placeholder.jpg"} alt={player.playerName} width={64} height={64} className="object-cover h-full w-full" loading={i < 3 ? "eager" : "lazy"} />
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors">
                    {player.playerName}
                  </h3>
                  <p className={`text-lg sm:text-xl font-black mt-1 ${config.color}`}>{player.rating}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{player.winRate}% win rate</p>
                  <div className="flex justify-center gap-2 mt-2 text-[10px] text-slate-400">
                    <span>{player.wins}W</span>
                    <span>·</span>
                    <span>{player.losses}L</span>
                  </div>
                  <Badge variant="outline" className={`mt-2 text-[8px] sm:text-[9px] ${config.color}`}>
                    {config.label}
                  </Badge>
                </motion.a>
              );
            })}
          </div>

          {/* Full Leaderboard */}
          <Leaderboard rankings={rankings} serverMode={{ page: 1, limit: 50 }} />
        </div>
      </section>

      {/* Rating History Chart */}
      <section className="py-20 sm:py-28 px-4 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Analytics</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
                Rating History
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                Track how top players&apos; ratings have evolved over the year.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <TrendingUp className="size-3.5 text-brand" /> <span>Season 2025-2026</span>
            </div>
          </motion.div>

          {/* RankingHistoryChart is a client component — provide an accessible table fallback for screen readers and noscript */}
          <RankingHistoryChart profiles={playerProfiles} />
          <noscript>
            <div className="mt-6">
              <h3 className="text-sm font-bold">Rating History (table fallback)</h3>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Player</th>
                      <th className="text-left">Recent Rating</th>
                      <th className="text-left">Tournaments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerProfiles.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2">{p.name}</td>
                        <td className="py-2">{p.rating}</td>
                        <td className="py-2">{p.totalTournaments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </noscript>
        </div>
      </section>

      {/* Tournament Standings */}
      <section className="py-20 sm:py-28 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Standings</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
                Tournament Results
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                Recent tournament standings and prize distribution.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <Users className="size-3.5 text-accent" /> <span>8 tournaments tracked</span>
            </div>
          </motion.div>

          <TournamentTable />
        </div>
      </section>

      {/* Player Profiles */}
      <section className="py-20 sm:py-28 px-4 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Profiles</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Player Profiles
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Explore detailed player statistics, achievements, and tournament history.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playerProfiles.map((p, i) => (
              <motion.a
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                href={`/players/${p.id}`}
                className="group block relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand/20"
              >
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                    <Image src={p.avatar || "/team/placeholder.jpg"} alt={p.name} width={64} height={64} className="object-cover h-full w-full" loading={i < 3 ? "eager" : "lazy"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-[10px] text-accent font-medium">{p.title}</p>
                      </div>
                      <span className={`text-xs font-black ${p.rank <= 3 ? "text-accent" : "text-slate-400"}`}>
                        #{p.rank}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge variant="outline" className="text-[9px]">{p.rating} pts</Badge>
                      <Badge variant="outline" className="text-[9px]">{p.winRate}% WR</Badge>
                      <Badge variant="outline" className="text-[9px]">{p.gamesPlayed} games</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                  <BarChart3 className="size-3" />
                  <span>{p.titles.length} titles &middot; {p.achievements.length} achievements</span>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-slate-400">Click on any player to view their full profile with statistics, achievements, and tournament history.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
