import { prisma } from "@/lib/prisma"
import type { Member } from "./domain"

type PrismaMember = {
  id: string; name: string; email: string; phone: string | null;
  userId: string | null; category: string; status: string;
  rating: number; gamesPlayed: number; wins: number;
  school: string | null; university: string | null;
  joinedAt: Date; createdAt: Date; updatedAt: Date;
}

function toMember(m: PrismaMember): Member {
  return {
    id: m.id, name: m.name, email: m.email, phone: m.phone ?? undefined,
    category: m.category, status: m.status, rating: m.rating,
    gamesPlayed: m.gamesPlayed, wins: m.wins,
    school: m.school ?? undefined, university: m.university ?? undefined,
    joinedAt: m.joinedAt.toISOString(),
  }
}

export const membersService = {
  async list(params: { page?: number; limit?: number; category?: string; status?: string } = {}) {
    const { page = 1, limit = 20, category, status } = params
    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (status) where.status = status

    const [rows, total] = await Promise.all([
      prisma.member.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.member.count({ where }),
    ])
    return { data: rows.map(toMember), total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async getById(id: string) {
    const m = await prisma.member.findUnique({ where: { id } })
    return m ? toMember(m) : null
  },

  async create(data: { name: string; email: string; phone?: string; category?: string; status?: string; school?: string; university?: string }) {
    const created = await prisma.member.create({
      data: { name: data.name, email: data.email, phone: data.phone ?? null, category: data.category ?? "individual", status: data.status ?? "active", school: data.school ?? null, university: data.university ?? null },
    })
    return toMember(created)
  },

  async update(id: string, data: Partial<Member>) {
    const updateData: Record<string, unknown> = { ...data }
    const updated = await prisma.member.update({ where: { id }, data: updateData as any })
    return toMember(updated)
  },

  async remove(id: string) {
    await prisma.member.delete({ where: { id } })
  },
}
