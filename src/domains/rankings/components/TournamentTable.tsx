"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Medal, Trophy } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { TournamentStanding } from "@/domains/rankings/domain";

const positionStyles = (pos: number) => {
  if (pos === 1) return "bg-gradient-to-br from-accent/15 to-accent/5 text-accent ring-1 ring-accent/20";
  if (pos === 2) return "bg-gradient-to-br from-slate-200/60 to-slate-100/30 text-slate-500 ring-1 ring-slate-300/30";
  if (pos === 3) return "bg-gradient-to-br from-amber-100/50 to-amber-50/20 text-amber-700 ring-1 ring-amber-300/30";
  return "bg-slate-50 dark:bg-slate-800/50 text-slate-400";
};

export function TournamentTable() {
  const [standings, setStandings] = useState<TournamentStanding[]>([]);

  useEffect(() => {
    fetch("/api/site-content?section=tournamentStandings")
      .then((r) => r.json())
      .then(setStandings)
      .catch(() => {});
  }, []);

  if (!standings.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Pos</th>
              <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Tournament</th>
              <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 hidden sm:table-cell">Date</th>
              <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 hidden md:table-cell">Players</th>
              <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Points</th>
              <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Prize</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {standings.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0, y: -6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
              >
                <td className="px-4 py-3.5">
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-extrabold ${positionStyles(t.position)}`}>
                    {t.position === 1 ? <Trophy className="size-3.5" /> : t.position <= 3 ? <Medal className="size-3" /> : `#${t.position}`}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{t.tournamentName}</p>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="size-3" /> {formatDate(t.date)}
                  </span>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell text-[11px] text-slate-500">{t.totalPlayers}</td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-bold text-brand">{t.points}</span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  {t.prize ? (
                    <span className="inline-block rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                      {t.prize}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">—</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}