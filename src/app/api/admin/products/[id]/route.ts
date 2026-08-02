import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { badRequest, unauthorized, serverError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { validateProductInput, updateProduct } from "@/lib/services/products";
import { validateOrigin } from "@/lib/csrf";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const originCheck = validateOrigin(request as unknown as Request);
    if (!originCheck.ok) return badRequest(originCheck.reason);

    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') return unauthorized();

    const body = await request.json();
    const valid = await validateProductInput(body);
    if (!valid.ok) return badRequest(valid.error);

    const res = await updateProduct(id, valid.data!, session.user.id);
    return new Response(JSON.stringify(res), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return serverError(err?.message);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const originCheck = validateOrigin(request as unknown as Request);
    if (!originCheck.ok) return badRequest(originCheck.reason);

    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') return unauthorized();

    await prisma.product.delete({ where: { id } });
    await prisma.auditLog.create({ data: { userId: session.user.id, action: 'product:delete', entity: 'Product', entityId: id } });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return serverError(err?.message);
  }
}
