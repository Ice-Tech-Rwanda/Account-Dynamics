import { prisma } from "@/lib/prisma"
import type { SuccessStory, HistoryMilestone, GalleryImage } from "./domain"

type PrismaSuccessStory = {
  id: string; name: string; age: number | null; school: string | null;
  university: string | null; role: string | null; story: string;
  achievement: string; image: string | null; order: number; createdAt: Date;
}

function toSuccessStory(s: PrismaSuccessStory): SuccessStory {
  return {
    id: s.id, name: s.name, age: s.age, school: s.school,
    university: s.university, role: s.role, story: s.story,
    achievement: s.achievement, image: s.image, order: s.order,
  }
}

export const impactService = {
  async listSuccessStories(limit = 6) {
    const stories = await prisma.successStory.findMany({
      orderBy: { order: "asc" },
      take: limit,
    })
    return stories.map(toSuccessStory)
  },

  async getHistoryMilestones() {
    const row = await prisma.siteContent.findUnique({
      where: { section: "historyMilestones" },
    })
    if (!row) return []
    return JSON.parse(row.content) as HistoryMilestone[]
  },

  async listGalleryImages(limit = 9) {
    const items = await prisma.galleryItem.findMany({
      orderBy: { date: "desc" },
      take: limit,
    })
    return items.map((g): GalleryImage => ({ src: g.src, album: g.title }))
  },
}
