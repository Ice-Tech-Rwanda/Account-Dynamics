import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { unauthorized, serverError } from "@/lib/api-helpers";
import { generateCsv } from "@/lib/services/donations";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const donations = await prisma.donation.findMany({ orderBy: { createdAt: "desc" } });
    const csv = generateCsv(donations);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=donations-${new Date().toISOString().slice(0,10)}.csv`,
      },
    });
  } catch {
    return serverError();
  }
}
