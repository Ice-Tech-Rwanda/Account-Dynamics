import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { validateUploadMeta } from "@/lib/services/resources";
import { badRequest, unauthorized } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return unauthorized();

  const body = await request.json();
  const { filename, size, mime } = body;
  if (!filename || !size) return badRequest("filename and size required");

  const res = validateUploadMeta(filename, Number(size), mime);
  if (!res.ok) return new Response(JSON.stringify({ ok: false, error: res.error }), { status: 400, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}
