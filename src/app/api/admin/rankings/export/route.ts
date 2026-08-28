import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateRankingsCsv } from "@/lib/services/rankings";
import { unauthorized, serverError } from "@/lib/api-helpers";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const rankings = await prisma.ranking.findMany({ orderBy: { rank: "asc" } });
    const csv = generateRankingsCsv(rankings);

    return new Response(csv, { status: 200, headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename=rankings-${new Date().toISOString().slice(0,10)}.csv` } });
  } catch {
    return serverError();
  }
}
