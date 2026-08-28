import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { publishResource, unpublishResource } from "@/lib/services/resources";
import { badRequest, unauthorized, serverError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const body = await request.json();
    const { id, action } = body;
    if (!id || !action) return badRequest("id and action required");

    if (action === 'publish') {
      await publishResource(id, session.user.id);
    } else if (action === 'unpublish') {
      await unpublishResource(id, session.user.id);
    } else {
      return badRequest('invalid action');
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return serverError(err?.message);
  }
}
