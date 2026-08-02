import { prisma } from "@/lib/prisma"
import type { SiteContent } from "./domain"

export type SuccessStoryItem = {
  id: string
  name: string
  story: string
  achievement?: string | null
  school?: string | null
  university?: string | null
  role?: string | null
  createdAt: string
}

function toSuccessStory(s: Record<string, unknown>): SuccessStoryItem {
  return {
    id: s.id as string,
    name: s.name as string,
    story: s.story as string,
    achievement: (s.achievement as string) ?? null,
    school: (s.school as string) ?? null,
    university: (s.university as string) ?? null,
    role: (s.role as string) ?? null,
    createdAt: (s.createdAt as Date).toISOString(),
  }
}

export const contentService = {
  async getSection(section: string) {
    const row = await prisma.siteContent.findUnique({ where: { section } })
    if (!row) return null
    return { section: row.section, content: JSON.parse(row.content), updatedAt: row.updatedAt.toISOString() } satisfies SiteContent
  },

  async getContactInfo() {
    const row = await prisma.siteContent.findUnique({ where: { section: "contactInfo" } })
    if (!row) return null
    return JSON.parse(row.content)
  },

  async upsertSection(section: string, content: unknown) {
    const row = await prisma.siteContent.upsert({
      where: { section },
      update: { content: JSON.stringify(content) },
      create: { section, content: JSON.stringify(content) },
    })
    return { section: row.section, content: JSON.parse(row.content), updatedAt: row.updatedAt.toISOString() } satisfies SiteContent
  },

  async getAllSections() {
    const rows = await prisma.siteContent.findMany()
    const map: Record<string, unknown> = {}
    for (const item of rows) map[item.section] = JSON.parse(item.content)
    return map
  },

  async getSuccessStories(params: { page?: number; limit?: number } = {}) {
    const { page = 1, limit = 20 } = params
    const skip = (page - 1) * limit
    const [stories, total] = await Promise.all([
      prisma.successStory.findMany({ orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.successStory.count(),
    ])
    const data = stories.map(toSuccessStory)
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  },
}
