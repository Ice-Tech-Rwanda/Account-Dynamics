import { prisma } from "@/lib/prisma"
import type { TeamMember } from "./domain"

type PrismaTeamMember = {
  id: string; name: string; role: string; avatar: string | null;
  bio: string; order: number; socialLinks: string | null;
  createdAt: Date; updatedAt: Date;
}

function toTeamMember(m: PrismaTeamMember): TeamMember {
  return {
    id: m.id, name: m.name, role: m.role,
    bio: m.bio, avatar: m.avatar ?? "/team/placeholder.jpg",
    socialLinks: m.socialLinks ? JSON.parse(m.socialLinks) : undefined,
  }
}

export const teamService = {
  async list(params: { page?: number; limit?: number } = {}) {
    const { page = 1, limit = 50 } = params
    const skip = (page - 1) * limit
    const [members, total] = await Promise.all([
      prisma.teamMember.findMany({ orderBy: { order: "asc" }, skip, take: limit }),
      prisma.teamMember.count(),
    ])
    const data = members.map(toTeamMember)
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async getById(id: string) {
    const m = await prisma.teamMember.findUnique({ where: { id } })
    return m ? toTeamMember(m) : null
  },

  async create(data: Partial<TeamMember>) {
    const createData: Record<string, unknown> = { ...data }
    if (data.socialLinks) createData.socialLinks = JSON.stringify(data.socialLinks)
    const created = await prisma.teamMember.create({ data: createData as any })
    return toTeamMember(created)
  },

  async update(id: string, data: Partial<TeamMember>) {
    const updateData: Record<string, unknown> = { ...data }
    if (data.socialLinks) updateData.socialLinks = JSON.stringify(data.socialLinks)
    const updated = await prisma.teamMember.update({ where: { id }, data: updateData as any })
    return toTeamMember(updated)
  },

  async remove(id: string) {
    await prisma.teamMember.delete({ where: { id } })
  },
}
