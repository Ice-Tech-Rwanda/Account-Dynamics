import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { unauthorized, serverError } from "@/lib/api-helpers";
import { generateOrdersCsv } from "@/lib/services/orders";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const where: any = {};
    if (status) where.status = status;

    const orders = await prisma.order.findMany({ where, orderBy: { createdAt: "desc" } });
    const csv = generateOrdersCsv(orders);

    return new Response(csv, { status: 200, headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename=orders-${new Date().toISOString().slice(0,10)}.csv` } });
  } catch {
    return serverError();
  }
}
