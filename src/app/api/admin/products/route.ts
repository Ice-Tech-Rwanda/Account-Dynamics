import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { badRequest, unauthorized, serverError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { validateProductInput, createProduct } from "@/lib/services/products";
import { validateOrigin } from "@/lib/csrf";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') return unauthorized();

    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get('page') ?? '1');
    const perPage = Number(searchParams.get('perPage') ?? '20');
    const skip = (page - 1) * perPage;
    const items = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, skip, take: perPage });
    const total = await prisma.product.count();
    return new Response(JSON.stringify({ items, total, page, perPage }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch {
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const originCheck = validateOrigin(request as unknown as Request);
    if (!originCheck.ok) return badRequest(originCheck.reason);

    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') return unauthorized();

    const body = await request.json();
    const valid = await validateProductInput(body);
    if (!valid.ok) return badRequest(valid.error);

    // Optionally verify signed image tokens on client-side upload flow; here we accept image urls
    const res = await createProduct(valid.data!, session.user.id);
    return new Response(JSON.stringify(res), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return serverError(err?.message);
  }
}
