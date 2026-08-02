"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Medal, ChevronLeft, ChevronRight, Award, Filter, X, MapPin } from "lucide-react";
import type { Ranking } from "@/domains/rankings/domain";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const medalColors: Record<string, string> = {
  Gold: "text-yellow-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.3)]",
  Silver: "text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.3)]",
  Bronze: "text-amber-600 drop-shadow-[0_0_6px_rgba(180,83,9,0.3)]",
};

const rankBg = (rank: number) => {
  if (rank === 1) return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-md shadow-yellow-400/20";
  if (rank === 2) return "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-white shadow-md shadow-slate-400/20";
  if (rank === 3) return "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-md shadow-amber-500/20";
  return "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";
};

const ITEMS_PER_PAGE = 10;

export function Leaderboard({ rankings, serverMode }: { rankings: Ranking[]; serverMode?: { page?: number; limit?: number } }) {
  const regions = [...new Set(rankings.map((r) => r.region).filter(Boolean))];
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(serverMode?.page ?? 1);
  const [selectedPlayer, setSelectedPlayer] = useState<Ranking | null>(null);
  const [serverData, setServerData] = useState<Ranking[] | null>(serverMode?.page === 1 ? rankings.slice(0, ITEMS_PER_PAGE) : null);
  const [serverTotalPages, setServerTotalPages] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let list = rankings;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.playerName.toLowerCase().includes(q));
    }
    if (regionFilter) {
      list = list.filter((r) => r.region === regionFilter);
    }
    return list;
  }, [search, regionFilter, rankings]);

  const totalPages = serverMode ? (serverTotalPages ?? 1) : Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = serverMode
    ? (serverData ?? [])
    : filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleReset = () => {
    setSearch("");
    setRegionFilter("");
    setCurrentPage(1);
  };

  const hasFilters = search || regionFilter;

  // If serverMode is enabled, fetch page data from API
  useEffect(() => {
    if (!serverMode) return;
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/rankings?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
        if (!res.ok) throw new Error("Failed to load page");
        const body = await res.json();
        if (!mounted) return;
        setServerData(body.data ?? []);
        setServerTotalPages(body.totalPages ?? 1);
      } catch {
        setServerData([]);
        setServerTotalPages(1);
      }
    };
    load();
    return () => { mounted = false };
  }, [currentPage, serverMode]);

  return (
    <div>
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
          <select
            value={regionFilter}
            onChange={(e) => { setRegionFilter(e.target.value); setCurrentPage(1) }}
            className="h-10 pl-9 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
          >
            <option value="">All Regions</option>
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 size-3 text-slate-400 pointer-events-none" />
        </div>
        {hasFilters && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs text-brand font-medium hover:underline whitespace-nowrap"
          >
            <X className="size-3" /> Clear
          </button>
        )}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 w-14">Rank</th>
                <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Player</th>
                <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 hidden sm:table-cell">Region</th>
                <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 hidden md:table-cell">Games</th>
                <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 hidden md:table-cell">W/L</th>
                <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Win Rate</th>
                <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Rating</th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              <AnimatePresence mode="popLayout">
                {paginated.map((player, i) => (
                  <motion.tr
                    key={player.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    onClick={() => setSelectedPlayer(selectedPlayer?.id === player.id ? null : player)}
                    className={`group cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30 ${selectedPlayer?.id === player.id ? "bg-slate-50 dark:bg-slate-800/40" : ""}`}
                  >
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-extrabold ${rankBg(player.rank)}`}>
                        {player.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-7 ring-2 ring-slate-100 dark:ring-slate-800">
                          <AvatarImage src={player.avatar || "/team/placeholder.jpg"} alt={player.playerName} />
                          <AvatarFallback className="text-[10px]">{player.playerName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-brand transition-colors">
                            {player.playerName}
                          </p>
                          {player.title && (
                            <p className="text-[10px] text-slate-400">{player.title}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-[11px] text-slate-500">{player.region}</span>
                    </td>
                    <td className="px-4 py-3.5 text-[11px] text-slate-500 hidden md:table-cell">{player.gamesPlayed}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-[11px] text-brand font-medium">{player.wins}W</span>
                      <span className="text-[11px] text-slate-300 mx-0.5">/</span>
                      <span className="text-[11px] text-red-400">{player.losses}L</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand">
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${player.winRate >= 70 ? "bg-brand" : player.winRate >= 60 ? "bg-accent" : "bg-slate-400"}`} />
                        {player.winRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                        {player.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {player.badge ? (
                        <Medal className={`size-4 inline-block ${medalColors[player.badge] || "text-slate-400"}`} />
                      ) : player.rank <= 5 ? (
                        <Award className="size-4 text-brand/50 inline-block" />
                      ) : null}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mt-4 text-xs"
        >
          <p className="text-slate-400">
            Page {currentPage} of {totalPages}
            <span className="hidden sm:inline"> &middot; {filtered.length} players</span>
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                  page === currentPage
                    ? "bg-brand text-white"
                    : "border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Expanded Row - quick detail */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-3"
          >
            <div className="rounded-xl border border-brand/20 bg-gradient-to-br from-brand/[0.04] to-transparent p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{selectedPlayer.playerName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Rating: <span className="font-bold text-accent">{selectedPlayer.rating}</span> &middot; Rank #{selectedPlayer.rank}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-[10px]">{selectedPlayer.gamesPlayed} games</Badge>
                    <Badge variant="outline" className="text-[10px]">{selectedPlayer.wins}W / {selectedPlayer.losses}L</Badge>
                    <Badge variant="outline" className="text-[10px]">{selectedPlayer.winRate}% win rate</Badge>
                    {selectedPlayer.region && <Badge variant="outline" className="text-[10px]">{selectedPlayer.region}</Badge>}
                  </div>
                </div>
                {selectedPlayer.title && (
                  <Badge variant="accent" className="text-[10px]">{selectedPlayer.title}</Badge>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}