import { prisma } from "@/lib/prisma"
import type { Partner, SponsorshipPackage } from "./domain"

type PrismaPartner = {
  id: string; name: string; logo: string; description: string;
  website: string | null; type: string; tier: string | null;
  stats: string | null; order: number; active: boolean;
  spotlight: boolean; yearEstablished: number | null;
  createdAt: Date; updatedAt: Date;
}

function toPartner(p: PrismaPartner): Partner {
  return {
    id: p.id, name: p.name, logo: p.logo, description: p.description,
    website: p.website ?? undefined, type: p.type, tier: p.tier ?? undefined,
    stats: p.stats ? JSON.parse(p.stats) : undefined,
    spotlight: p.spotlight || undefined,
  }
}

export const partnersService = {
  async list(params: { page?: number; limit?: number } = {}) {
    const { page = 1, limit = 50 } = params
    const skip = (page - 1) * limit
    const [rows, total] = await Promise.all([
      prisma.partner.findMany({ orderBy: { order: "asc" }, skip, take: limit }),
      prisma.partner.count(),
    ])
    const data = rows.map(toPartner)
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async create(data: { name: string; logo: string; description: string; website?: string; type: string; tier?: string }) {
    const created = await prisma.partner.create({
      data: { name: data.name, logo: data.logo, description: data.description, website: data.website ?? null, type: data.type, tier: data.tier ?? null, order: 0, active: true, spotlight: false, yearEstablished: null, stats: null },
    })
    return toPartner(created)
  },

  async update(id: string, data: Partial<Partner>) {
    const updateData: Record<string, unknown> = { ...data }
    if (data.stats) updateData.stats = JSON.stringify(data.stats)
    const updated = await prisma.partner.update({ where: { id }, data: updateData as any })
    return toPartner(updated)
  },

  async remove(id: string) {
    await prisma.partner.delete({ where: { id } })
  },

  async getSponsorshipPackages(params: { page?: number; limit?: number } = {}) {
    const { page = 1, limit = 20 } = params
    const skip = (page - 1) * limit
    const [packages, total] = await Promise.all([
      prisma.sponsorshipPackage.findMany({ orderBy: { order: "asc" }, skip, take: limit }),
      prisma.sponsorshipPackage.count(),
    ])
    const data = packages.map((p): SponsorshipPackage => ({
      id: p.id, name: p.name, price: p.price, description: p.description,
      benefits: JSON.parse(p.benefits), popular: p.popular || undefined,
    }))
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  },
}
