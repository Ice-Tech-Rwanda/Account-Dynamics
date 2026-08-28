import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";
import { verifySignedToken } from "@/lib/uploads/signer";

export async function updateRanking(id: string, updates: any, userId?: string, idempotencyKey?: string, signedToken?: string) {
  try {
    if (!signedToken) throw new Error("signedToken required");
    const ok = verifySignedToken(`ranking:${id}`, signedToken);
    if (!ok) throw new Error("invalid signed token");

    if (idempotencyKey) {
      const existing = await prisma.auditLog.findFirst({ where: { entity: "Ranking", details: { contains: `idempotency:${idempotencyKey}` } } });
      if (existing) return { ok: true, idempotent: true };
    }

    const before = await prisma.ranking.findUnique({ where: { id } });
    if (!before) throw new Error("Ranking not found");

    const updated = await prisma.ranking.update({ where: { id }, data: updates as any });

    const details = `prev:${encodeURIComponent(JSON.stringify(before))};next:${encodeURIComponent(JSON.stringify(updated))}${idempotencyKey ? `;idempotency:${idempotencyKey}` : ""}`;
    await prisma.auditLog.create({ data: { userId: userId ?? undefined, action: "ranking:update", entity: "Ranking", entityId: id, details } });

    return { ok: true, ranking: updated };
  } catch (err) {
    logger.error("updateRanking failed", { err: String(err), id, updates });
    throw err;
  }
}

export async function rollbackRanking(id: string, userId?: string) {
  try {
    const last = await prisma.auditLog.findFirst({ where: { entity: "Ranking", entityId: id, action: { in: ["ranking:update", "ranking:import"] } }, orderBy: { createdAt: "desc" } });
    if (!last || !last.details) throw new Error("No previous change to rollback");

    const match = /prev:([^;]+);?/.exec(last.details);
    if (!match) throw new Error("No prev snapshot in audit log");

    const prev = JSON.parse(decodeURIComponent(match[1]));

    const restored = await prisma.ranking.update({ where: { id }, data: { rank: prev.rank, rating: prev.rating ?? 0, gamesPlayed: prev.gamesPlayed ?? 0, wins: prev.wins ?? 0, losses: prev.losses ?? 0, winRate: prev.winRate ?? 0, badge: prev.badge ?? null } as any });

    const details = `restored_from:${last.id};restored_snapshot:${encodeURIComponent(JSON.stringify(prev))}`;
    await prisma.auditLog.create({ data: { userId: userId ?? undefined, action: "ranking:rollback", entity: "Ranking", entityId: id, details } });

    return { ok: true, ranking: restored };
  } catch (err) {
    logger.error("rollbackRanking failed", { err: String(err), id });
    throw err;
  }
}

export function generateRankingsCsv(rows: any[]) {
  const headers = ["id", "memberId", "rank", "rating", "gamesPlayed", "wins", "losses", "winRate", "badge", "createdAt", "updatedAt"];
  const csvRows = rows.map((r) => [r.id, r.memberId, String(r.rank), String(r.rating ?? ""), String(r.gamesPlayed ?? ""), String(r.wins ?? ""), String(r.losses ?? ""), String(r.winRate ?? ""), r.badge ?? "", r.createdAt ? new Date(r.createdAt).toISOString() : "", r.updatedAt ? new Date(r.updatedAt).toISOString() : ""]);
  const csv = [headers.join(","), ...csvRows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  return csv;
}

export async function importRankingsFromCsv(csvText: string, userId?: string) {
  try {
    const lines = csvText.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) throw new Error("CSV must have header + at least one row");
    const header = lines[0].split(",").map((h) => h.trim());
    const required = ["memberId", "rank"];
    for (const r of required) if (!header.includes(r)) throw new Error(`Missing header: ${r}`);

    const rows = lines.slice(1).map((ln) => {
      // naive CSV parse for common cases
      const parts = ln.split(",").map((s) => s.replace(/^"|"$/g, "").trim());
      const obj: any = {};
      header.forEach((h, i) => (obj[h] = parts[i] ?? ""));
      return obj;
    });

    const ranks = rows.map((r) => Number(r.rank));
    const dup = ranks.find((v, i) => ranks.indexOf(v) !== i);
    if (dup !== undefined) throw new Error("Duplicate ranks in CSV");

    // check conflicts with existing rankings
    const existing = await prisma.ranking.findMany({ where: { rank: { in: ranks } } });
    for (const ex of existing) {
      const row = rows.find((r) => Number(r.rank) === ex.rank);
      if (row && row.memberId !== ex.memberId) throw new Error(`Rank ${ex.rank} already owned by another member`);
    }

    const processed: any[] = [];
    for (const r of rows) {
      const memberId = r.memberId;
      const rank = Number(r.rank);
      const rating = r.rating ? Number(r.rating) : 0;
      const up = await prisma.ranking.upsert({ where: { memberId }, update: { rank, rating }, create: { memberId, rank, rating } as any });
      processed.push(up);
    }

    const details = `imported:${processed.length};sample:${encodeURIComponent(JSON.stringify(processed.slice(0,3)))}`;
    await prisma.auditLog.create({ data: { userId: userId ?? undefined, action: "ranking:import", entity: "Ranking", details } });

    return { ok: true, processedCount: processed.length };
  } catch (err) {
    logger.error("importRankingsFromCsv failed", { err: String(err) });
    throw err;
  }
}
