import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"
import type { Resource } from "./domain"

type PrismaArticle = {
  id: string; title: string; slug: string; description: string; content: string;
  category: string; image: string | null; authorId: string | null;
  readTime: string | null; published: boolean; publishedAt: Date | null;
  createdAt: Date; updatedAt: Date;
}

function toResource(a: PrismaArticle): Resource {
  return {
    id: a.id, title: a.title, slug: a.slug, description: a.description,
    category: a.category as Resource["category"], content: a.content, image: a.image ?? undefined,
    authorRole: undefined, author: a.authorId ?? "",
    publishedAt: a.publishedAt?.toISOString() ?? undefined,
    readTime: a.readTime ?? undefined,
    featured: a.published || undefined,
  }
}

export const resourcesService = {
  async list(params: { page?: number; limit?: number; category?: string; search?: string } = {}) {
    const { page = 1, limit = 12, category, search } = params
    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}
    if (category && category !== "all") where.category = category
    if (search) where.title = { contains: search }

    const [rows, total] = await Promise.all([
      prisma.article.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.article.count({ where }),
    ])
    return { data: rows.map(toResource), total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async getBySlug(slug: string) {
    const a = await prisma.article.findUnique({ where: { slug } })
    return a ? toResource(a) : null
  },

  async create(data: Partial<Resource>) {
    const slug = data.slug ?? slugify(data.title ?? "")
    const article = await prisma.article.create({
      data: {
        title: data.title!, slug, description: data.description ?? "", content: data.content ?? "",
        category: data.category ?? "article", image: data.image ?? null, authorId: null,
        readTime: data.readTime ?? null, published: data.featured ?? false,
        publishedAt: data.featured ? new Date() : null,
      } as any,
    })
    return toResource(article)
  },
}
