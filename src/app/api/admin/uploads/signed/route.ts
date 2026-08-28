import { NextRequest } from "next/server";
import { generateSignedToken } from "@/lib/uploads/signer";
import { auth } from "@/lib/auth";
import { unauthorized } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return unauthorized();

  const body = await request.json().catch(() => ({}));
  const filename = (body.filename as string) || `upload-${Date.now()}`;
  const token = generateSignedToken(filename, 300);
  return new Response(JSON.stringify({ uploadPath: `/uploads/${filename}`, token }), { status: 200, headers: { "Content-Type": "application/json" } });
}
