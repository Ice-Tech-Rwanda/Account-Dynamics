import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";
import { z } from "zod";
import { generateSignedToken } from "@/lib/uploads/signer";

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export function generateProductImageToken(filename: string, expiresIn = 300) {
  return generateSignedToken(`product-img:${filename}`, expiresIn);
}

export async function validateProductInput(input: any) {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.message };
  return { ok: true, data: parsed.data };
}

export async function createProduct(data: ProductInput, userId?: string) {
  try {
    const slug =
      data.slug ??
      (data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || `product-${Date.now()}`);
    const created = await prisma.product.create({ data: { name: data.name, slug, description: data.description ?? '', price: data.price, stock: data.stock, images: JSON.stringify(data.images ?? []), category: 'general' } as any });
    await prisma.auditLog.create({ data: { userId: userId ?? undefined, action: 'product:create', entity: 'Product', entityId: created.id, details: JSON.stringify(data) } });
    return { ok: true, product: created };
  } catch (err) {
    logger.error('createProduct failed', { err: String(err), data });
    throw err;
  }
}

export async function updateProduct(id: string, data: Partial<ProductInput>, userId?: string) {
  try {
    const before = await prisma.product.findUnique({ where: { id } });
    if (!before) return { ok: false, error: 'not_found' };
    const updated = await prisma.product.update({ where: { id }, data: { name: data.name ?? before.name, slug: data.slug ?? before.slug, description: data.description ?? before.description, price: data.price ?? before.price, stock: data.stock ?? before.stock, images: data.images ? JSON.stringify(data.images) : before.images } as any });
    await prisma.auditLog.create({ data: { userId: userId ?? undefined, action: 'product:update', entity: 'Product', entityId: id, details: `prev:${JSON.stringify(before)};next:${JSON.stringify(updated)}` } });
    return { ok: true, product: updated };
  } catch (err) {
    logger.error('updateProduct failed', { err: String(err), id, data });
    throw err;
  }
}
