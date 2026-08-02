import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { unauthorized, serverError } from "@/lib/api-helpers";
import { generateMembersCsv } from "@/lib/services/members";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const members = await prisma.member.findMany({ orderBy: { createdAt: "desc" } });
    const csv = generateMembersCsv(members);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=members-${new Date().toISOString().slice(0,10)}.csv`,
      },
    });
  } catch {
    return serverError();
  }
}
