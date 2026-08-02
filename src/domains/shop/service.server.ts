import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"
import type { Product } from "./domain"

type PrismaProduct = {
  id: string; name: string; slug: string; description: string;
  shortDescription: string | null; price: number; comparePrice: number | null;
  images: string; category: string; inStock: boolean; stock: number;
  featured: boolean; createdAt: Date; updatedAt: Date;
}

function toProduct(p: PrismaProduct): Product {
  return {
    id: p.id, name: p.name, slug: p.slug, description: p.description,
    shortDescription: p.shortDescription ?? undefined, price: p.price,
    comparePrice: p.comparePrice ?? undefined,
    images: JSON.parse(p.images), category: p.category,
    inStock: p.inStock, stock: p.stock, featured: p.featured || undefined,
    rating: 0, reviewCount: 0, reviews: [],
  }
}

export const shopService = {
  async list(params: { page?: number; limit?: number; category?: string } = {}) {
    const { page = 1, limit = 12, category } = params
    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}
    if (category) where.category = category

    const [rows, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.product.count({ where }),
    ])
    const data = rows.map(toProduct)
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async getBySlug(slug: string) {
    const p = await prisma.product.findUnique({ where: { slug } })
    return p ? toProduct(p) : null
  },

  async getById(id: string) {
    const p = await prisma.product.findUnique({ where: { id } })
    return p ? toProduct(p) : null
  },

  async create(data: { name: string; slug?: string; description: string; shortDescription?: string; price: number; comparePrice?: number; images?: string[]; category: string; inStock?: boolean; stock?: number; featured?: boolean }) {
    const slug = data.slug ?? slugify(data.name)
    const created = await prisma.product.create({
      data: { name: data.name, slug, description: data.description, shortDescription: data.shortDescription ?? null, price: data.price, comparePrice: data.comparePrice ?? null, images: JSON.stringify(data.images ?? []), category: data.category, inStock: data.inStock ?? true, stock: data.stock ?? 0, featured: data.featured ?? false },
    })
    return toProduct(created)
  },

  async update(id: string, data: Partial<Product>) {
    const updateData: Record<string, unknown> = { ...data }
    if (data.images) updateData.images = JSON.stringify(data.images)
    const updated = await prisma.product.update({ where: { id }, data: updateData as any })
    return toProduct(updated)
  },

  async remove(id: string) {
    await prisma.product.delete({ where: { id } })
  },
}
