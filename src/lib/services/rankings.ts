export function generateRankingsCsv(rows: any[]) {
  const headers = ["id", "memberId", "rank", "rating", "gamesPlayed", "wins", "losses", "winRate", "badge", "createdAt", "updatedAt"];
  const csvRows = rows.map((r) => [r.id, r.memberId, String(r.rank), String(r.rating ?? ""), String(r.gamesPlayed ?? ""), String(r.wins ?? ""), String(r.losses ?? ""), String(r.winRate ?? ""), r.badge ?? "", r.createdAt ? new Date(r.createdAt).toISOString() : "", r.updatedAt ? new Date(r.updatedAt).toISOString() : ""]);
  const csv = [headers.join(","), ...csvRows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  return csv;
}
