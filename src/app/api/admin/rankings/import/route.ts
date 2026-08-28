import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { importRankingsFromCsv } from "@/lib/services/rankings";
import { badRequest, unauthorized, serverError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const text = await request.text();
    if (!text) return badRequest("CSV body required");

    const res = await importRankingsFromCsv(text, session.user.id);
    return new Response(JSON.stringify(res), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return serverError(err?.message);
  }
}
