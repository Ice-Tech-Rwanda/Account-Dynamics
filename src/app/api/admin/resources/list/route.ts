import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { paginateResources } from "@/lib/services/resources";
import { unauthorized, serverError } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get('page') ?? '1');
    const perPage = Number(searchParams.get('perPage') ?? '20');
    const q = searchParams.get('q') ?? undefined;

    const res = await paginateResources(page, perPage, q ?? undefined);
    return new Response(JSON.stringify(res), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return serverError();
  }
}
