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
    // create two members and rankings (use existing Member if present)
    const m1 = await prisma.member.create({ data: { name: "Test A", email: `a-${Date.now()}@example.com` } });
    const m2 = await prisma.member.create({ data: { name: "Test B", email: `b-${Date.now()}@example.com` } });

    await prisma.ranking.create({ data: { memberId: m1.id, rank: 1, rating: 1200 } });
    await prisma.ranking.create({ data: { memberId: m2.id, rank: 2, rating: 1100 } });

    const rows = await prisma.ranking.findMany({ orderBy: { rank: "asc" } });
    const csv = generateRankingsCsv(rows);
    expect(csv).toContain("memberId");

    const importRes = await importRankingsFromCsv(csv, "test-user");
    expect(importRes.ok).toBeTruthy();
  });

  test("update then rollback preserves previous rank", async () => {
    const member = await prisma.member.create({ data: { name: "Rollback Test", email: `r-${Date.now()}@example.com` } });
    const r = await prisma.ranking.create({ data: { memberId: member.id, rank: 50, rating: 900 } });

    // create a signed token using same method as app; if not available, skip update
    // here we'll simulate by updating directly via prisma (service requires signed token in production)
    const updated = await prisma.ranking.update({ where: { id: r.id }, data: { rank: 10 } });
    await prisma.auditLog.create({ data: { userId: "test", action: "ranking:update", entity: "Ranking", entityId: r.id, details: `prev:${encodeURIComponent(JSON.stringify(r))};next:${encodeURIComponent(JSON.stringify(updated))}` } });

    const res = await rollbackRanking(r.id, "test");
    expect(res.ok).toBeTruthy();
    expect(res.ranking.rank).toBe(50);
  });
});
