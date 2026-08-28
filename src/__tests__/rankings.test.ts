import { prisma } from "@/lib/prisma";
import { rollbackRanking, generateRankingsCsv, importRankingsFromCsv } from "@/lib/services/rankings";

describe("rankings service", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("generate CSV and import roundtrip", async () => {
    const m1 = await prisma.member.create({ data: { name: "Test A", email: `a-${Date.now()}@example.com` } });
    const m2 = await prisma.member.create({ data: { name: "Test B", email: `b-${Date.now()}@example.com` } });

    const maxRank = await prisma.ranking.aggregate({ _max: { rank: true } });
    const next = (maxRank._max.rank ?? 0) + 1;

    await prisma.ranking.create({ data: { memberId: m1.id, rank: next, rating: 1200 } });
    await prisma.ranking.create({ data: { memberId: m2.id, rank: next + 1, rating: 1100 } });

    const rows = await prisma.ranking.findMany({ orderBy: { rank: "asc" } });
    const csv = generateRankingsCsv(rows);
    expect(csv).toContain("memberId");

    const importRes = await importRankingsFromCsv(csv, "test-user");
    expect(importRes.ok).toBeTruthy();

    await prisma.ranking.deleteMany({ where: { memberId: { in: [m1.id, m2.id] } } });
    await prisma.member.deleteMany({ where: { id: { in: [m1.id, m2.id] } } });
  });

  test("update then rollback preserves previous rank", async () => {
    const member = await prisma.member.create({ data: { name: "Rollback Test", email: `r-${Date.now()}@example.com` } });

    const maxRank = await prisma.ranking.aggregate({ _max: { rank: true } });
    const next = (maxRank._max.rank ?? 0) + 1;

    const r = await prisma.ranking.create({ data: { memberId: member.id, rank: next, rating: 900 } });

    const updated = await prisma.ranking.update({ where: { id: r.id }, data: { rank: next + 100 } });
    await prisma.auditLog.create({ data: { userId: "test", action: "ranking:update", entity: "Ranking", entityId: r.id, details: `prev:${encodeURIComponent(JSON.stringify(r))};next:${encodeURIComponent(JSON.stringify(updated))}` } });

    const res = await rollbackRanking(r.id, "test");
    expect(res.ok).toBeTruthy();
    expect(res.ranking.rank).toBe(next);

    await prisma.ranking.deleteMany({ where: { memberId: member.id } });
    await prisma.member.deleteMany({ where: { id: member.id } });
  });
});
