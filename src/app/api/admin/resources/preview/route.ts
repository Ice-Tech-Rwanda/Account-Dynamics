import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { previewAccessibility } from "@/lib/services/resources";
import { badRequest, unauthorized, serverError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const body = await request.json();
    const { fileUrl } = body;
    if (!fileUrl) return badRequest("fileUrl required");

    const res = await previewAccessibility(fileUrl);
    return new Response(JSON.stringify(res), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return serverError(err?.message);
  }
}
