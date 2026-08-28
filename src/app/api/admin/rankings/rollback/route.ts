import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { rollbackRanking } from "@/lib/services/rankings";
import { badRequest, unauthorized, serverError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const body = await request.json();
    const { id } = body;
    if (!id) return badRequest("id required");

    const res = await rollbackRanking(id, session.user.id);
    return new Response(JSON.stringify(res), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return serverError(err?.message);
  }
}
