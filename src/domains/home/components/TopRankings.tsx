"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Medal, ArrowRight, Crown, Star, Trophy } from "lucide-react";

export interface RankingPlayer {
  id: string
  playerName: string
  rank: number
  rating: number
  winRate: number
  badge?: string
  gamesPlayed: number
}

const medalIcons = [
  { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-100", ring: "ring-yellow-400/40" },
  { icon: Medal, color: "text-slate-400", bg: "bg-slate-100", ring: "ring-slate-300/40" },
  { icon: Medal, color: "text-amber-600", bg: "bg-amber-100", ring: "ring-amber-500/40" },
];

const podiumHeights = ["h-36", "h-28", "h-24"];

export function TopRankings({ rankings }: { rankings: RankingPlayer[] }) {
  const top3 = rankings.filter((r) => r.rank <= 3);
  const rest = rankings.filter((r) => r.rank > 3 && r.rank <= 8);

  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden bg-slate-50/80">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(13,122,62,0.03),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,168,67,0.03),transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="it-kicker">Rankings</span>
          <h2 className="it-title">Top Players</h2>
          <p className="it-copy max-w-xl mx-auto">
            Our club&apos;s highest-rated players based on tournament performance.
          </p>
        </motion.div>

        {rankings.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="size-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No rankings available yet.</p>
            <p className="text-sm text-slate-400 mt-1">Rankings will appear once tournaments are played.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-end gap-4 sm:gap-6 mb-14 px-4">
              {top3.length < 3 ? (
                <p className="text-slate-400 text-sm">Need at least 3 ranked players to display podium.</p>
              ) : (
                [top3[1], top3[0], top3[2]].map((player, idx) => {
                  const actualRank = player?.rank || 0;
                  const mi = actualRank - 1;
                  const MedIcon = medalIcons[mi]?.icon || Medal;
                  const isFirst = actualRank === 1;

                  return (
                    <motion.div
                      key={player?.id || idx}
                      initial={{ opacity: 0, y: 60 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15, duration: 0.6, ease: "backOut" }}
                      className="flex flex-col items-center"
                      style={{ order: idx }}
                    >
                      <div className={`relative ${isFirst ? "scale-110" : "scale-100"} mb-4`}>
                        <div className={`mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full ${medalIcons[mi]?.bg || "bg-slate-100"} ${medalIcons[mi]?.ring || "ring-slate-200"} ring-2 shadow-lg transition-transform duration-300 hover:scale-110`}>
                          <MedIcon className={`size-7 sm:size-8 ${medalIcons[mi]?.color || "text-slate-500"}`} />
                        </div>
                        {isFirst && (
                          <div className="absolute -top-2 -right-2">
                            <Crown className="size-5 text-accent drop-shadow" />
                          </div>
                        )}
                      </div>

                      <p className="text-sm sm:text-base font-bold text-slate-800 text-center">{player?.playerName}</p>
                      <p className="text-2xl sm:text-3xl font-black text-brand mt-1">{player?.rating}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{player?.winRate}% win rate</p>

                      <div className={`mt-3 w-16 sm:w-20 rounded-t-lg bg-gradient-to-t from-brand/10 to-transparent border border-brand/10 ${podiumHeights[mi] || "h-20"} flex items-end justify-center pb-2`}>
                        <span className="text-[10px] font-bold text-brand uppercase tracking-wider">#{actualRank}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden shadow-lg"
            >
              {rest.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-6">No additional rankings to display.</p>
              ) : (
                rest.map((player, i) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-7 text-center text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                        {player.rank}
                      </span>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                          {player.playerName}
                        </span>
                        {player.badge && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent border border-accent/20">
                            <Star className="size-2.5" /> {player.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="text-[11px] text-slate-400">{player.gamesPlayed} games</span>
                      <span className="text-sm font-bold text-brand">{player.rating}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <Link href="/rankings">
                <Button variant="brand" className="rounded-xl gap-2 shadow-lg shadow-brand/20">
                  Full Leaderboard <ArrowRight className="size-4" />
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
