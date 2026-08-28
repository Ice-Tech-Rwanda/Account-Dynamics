import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { generateProductImageToken } from "@/lib/services/products";
import { badRequest, unauthorized } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return unauthorized();

  const body = await request.json();
  const { filename, expires } = body;
  if (!filename) return badRequest('filename required');

  const token = generateProductImageToken(filename, Number(expires ?? 300));
  return new Response(JSON.stringify({ token }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
