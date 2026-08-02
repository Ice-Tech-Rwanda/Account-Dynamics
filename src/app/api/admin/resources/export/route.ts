import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateResourcesCsv } from "@/lib/services/resources";
import { unauthorized, serverError } from "@/lib/api-helpers";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const rows = await prisma.resource.findMany({ orderBy: { updatedAt: 'desc' } });
    const csv = generateResourcesCsv(rows);

    return new Response(csv, { status: 200, headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename=resources-${new Date().toISOString().slice(0,10)}.csv` } });
  } catch {
    return serverError();
  }
}
