"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { PlayerProfile } from "@/domains/rankings/domain";

const COLORS = ["var(--accent)", "#22c55e", "#3b82f6", "#ef4444", "#a855f7"];

export function RankingHistoryChart({ profiles }: { profiles: PlayerProfile[] }) {
  const [selected, setSelected] = useState(profiles.slice(0, 3).map((p) => p.id));
  const allSelected = selected.length >= profiles.length;

  const chartData = profiles[0].ratingHistory.map((_, i) => {
    const point: Record<string, string | number> = { month: profiles[0].ratingHistory[i].month };
    profiles.forEach((p) => {
      point[p.name] = p.ratingHistory[i].rating;
    });
    return point;
  });

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length === 1) return;
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div>
      {/* Legend Toggles */}
      <div className="flex flex-wrap gap-2 mb-5">
        {profiles.map((p, i) => (
          <button
            key={p.id}
            onClick={() => toggle(p.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-medium transition-all ${
              selected.includes(p.id)
                ? "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
            {p.name}
          </button>
        ))}
        <button
          onClick={() => setSelected(allSelected ? [] : profiles.map((p) => p.id))}
          className="inline-flex items-center gap-1 rounded-lg border border-transparent px-2.5 py-1 text-[10px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm"
      >
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-slate-400" />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-slate-400" domain={["dataMin - 50", "dataMax + 50"]} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.08)",
                fontSize: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
              labelClassName="font-bold text-slate-900"
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            {profiles
              .filter((p) => selected.includes(p.id))
              .map((p, i) => (
                <Line
                  key={p.id}
                  type="monotone"
                  dataKey={p.name}
                  stroke={COLORS[i]}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  connectNulls
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}