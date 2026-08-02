import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"
import type { Event, EventListParams } from "./domain"

type PrismaEvent = {
  id: string; title: string; slug: string; description: string; shortDescription: string | null;
  category: string; startDate: Date; endDate: Date | null; location: string;
  image: string | null; registrationUrl: string | null; status: string; maxParticipants: number | null;
  currentParticipants: number | null; featured: boolean; createdAt: Date; updatedAt: Date;
}

function toEvent(e: PrismaEvent): Event {
  return {
    id: e.id, title: e.title, slug: e.slug, description: e.description,
    shortDescription: e.shortDescription ?? undefined, category: e.category,
    startDate: e.startDate.toISOString(), endDate: e.endDate?.toISOString() ?? undefined,
    location: e.location, image: e.image ?? undefined, registrationUrl: e.registrationUrl ?? undefined,
    status: e.status as Event["status"], maxParticipants: e.maxParticipants ?? undefined,
    currentParticipants: e.currentParticipants ?? undefined, featured: e.featured ?? undefined,
    speakers: undefined, schedule: undefined, gallery: undefined, prizes: undefined, price: undefined,
  }
}

export const eventsService = {
  async list(params: EventListParams = {}) {
    const { page = 1, limit = 12, category, search, status } = params
    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}
    if (category && category !== "all") where.category = category
    if (search) where.title = { contains: search }
    if (status) where.status = status

    const [rows, total] = await Promise.all([
      prisma.event.findMany({ where, orderBy: { startDate: "desc" }, skip, take: limit }),
      prisma.event.count({ where }),
    ])
    return { events: rows.map(toEvent), total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async getBySlug(slug: string) {
    const e = await prisma.event.findUnique({ where: { slug } })
    return e ? toEvent(e) : null
  },

  async getById(id: string) {
    const e = await prisma.event.findUnique({ where: { id } })
    return e ? toEvent(e) : null
  },

  async create(data: Partial<Event>) {
    const slug = data.slug ?? slugify(data.title ?? "")
    const created = await prisma.event.create({
      data: {
        title: data.title!, slug, description: data.description!, category: data.category ?? "weekly",
        status: data.status ?? "upcoming", location: data.location!, startDate: new Date(data.startDate!),
        endDate: data.endDate ? new Date(data.endDate) : null,
        shortDescription: data.shortDescription ?? null,
        image: data.image ?? null, registrationUrl: data.registrationUrl ?? null,
        maxParticipants: data.maxParticipants ?? null, currentParticipants: data.currentParticipants ?? 0,
        featured: data.featured ?? false,
      } as any,
    })
    return toEvent(created)
  },

  async update(id: string, data: Partial<Event>) {
    const updateData: Record<string, unknown> = { ...data }
    if (data.startDate) updateData.startDate = new Date(data.startDate)
    if (data.endDate) updateData.endDate = new Date(data.endDate)
    const updated = await prisma.event.update({ where: { id }, data: updateData as any })
    return toEvent(updated)
  },

  async remove(id: string) {
    await prisma.event.delete({ where: { id } })
  },

  async getCategories() {
    const rows = await prisma.eventCategory.findMany({ orderBy: { name: "asc" } })
    return rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description, color: c.color, icon: c.icon, count: c.count }))
  },
}
