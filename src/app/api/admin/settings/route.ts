import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getSettings, upsertSettings, settingsSchema } from "@/lib/services/settings";
import { badRequest, unauthorized, serverError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') return unauthorized();

    const settings = await getSettings();
    return new Response(JSON.stringify(settings), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return serverError(err?.message);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') return unauthorized();

    const body = await request.json();
    const parsed = settingsSchema.partial().safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const res = await upsertSettings(parsed.data, session.user.id);
    return new Response(JSON.stringify(res), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return serverError(err?.message);
  }
}
