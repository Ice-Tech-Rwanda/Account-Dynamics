import { prisma } from "@/lib/prisma"
import type { GalleryItem } from "./domain"

type PrismaGalleryItem = {
  id: string; src: string; title: string; description: string | null;
  category: string | null; type: string; videoUrl: string | null; date: Date;
  blurDataUrl: string | null; order: number; createdAt: Date;
}

function toGalleryItem(g: PrismaGalleryItem): GalleryItem {
  return {
    id: g.id, src: g.src, title: g.title, description: g.description ?? undefined,
    category: g.category ?? "", type: g.type, videoUrl: g.videoUrl ?? undefined,
    date: g.date.toISOString(),
  }
}

export const galleryService = {
  async list(params: { page?: number; limit?: number; category?: string } = {}) {
    const { page = 1, limit = 20, category } = params
    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}
    if (category && category !== "all") where.category = category

    const [rows, total] = await Promise.all([
      prisma.galleryItem.findMany({ where, orderBy: { date: "desc" }, skip, take: limit }),
      prisma.galleryItem.count({ where }),
    ])
    const data = rows.map(toGalleryItem)
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async getById(id: string) {
    const g = await prisma.galleryItem.findUnique({ where: { id } })
    return g ? toGalleryItem(g) : null
  },

  async create(data: { src: string; title: string; description?: string; category?: string; type?: string; videoUrl?: string; date?: string; order?: number }) {
    const created = await prisma.galleryItem.create({
      data: { src: data.src, title: data.title, description: data.description ?? null, category: data.category ?? null, type: data.type ?? "image", videoUrl: data.videoUrl ?? null, date: data.date ? new Date(data.date) : new Date(), order: data.order ?? 0 },
    })
    return toGalleryItem(created)
  },

  async update(id: string, data: Partial<GalleryItem>) {
    const updateData: Record<string, unknown> = { ...data }
    if (data.date) updateData.date = new Date(data.date)
    const updated = await prisma.galleryItem.update({ where: { id }, data: updateData as any })
    return toGalleryItem(updated)
  },

  async remove(id: string) {
    await prisma.galleryItem.delete({ where: { id } })
  },
}
