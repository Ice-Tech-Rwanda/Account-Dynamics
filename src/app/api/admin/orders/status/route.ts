import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { changeOrderStatus } from "@/lib/services/orders";
import { badRequest, unauthorized, serverError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const body = await request.json();
    const { orderId, status, idempotencyKey } = body;
    if (!orderId || !status) return badRequest("orderId and status required");

    await changeOrderStatus(orderId, status, session.user.id, idempotencyKey);

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return serverError(err?.message);
  }
}
