import { prisma } from "@/lib/prisma"
import type { Donation } from "./domain"

function toDonation(d: {
  id: string; createdAt: Date; status: string; donorName: string; donorEmail: string;
  amount: number; anonymous: boolean; message: string | null;
}): Donation {
  return { id: d.id, donorName: d.donorName, donorEmail: d.donorEmail, amount: d.amount, anonymous: d.anonymous, message: d.message ?? undefined, date: d.createdAt.toISOString(), status: d.status as Donation["status"] }
}

export const donationsService = {
  async list(params: { page?: number; limit?: number } = {}) {
    const { page = 1, limit = 20 } = params
    const skip = (page - 1) * limit
    const [rows, total] = await Promise.all([
      prisma.donation.findMany({ orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.donation.count(),
    ])
    return { data: rows.map(toDonation), total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async create(data: { donorName: string; donorEmail: string; amount: number; anonymous?: boolean; message?: string }) {
    const created = await prisma.donation.create({ data: { donorName: data.donorName, donorEmail: data.donorEmail, amount: data.amount, anonymous: data.anonymous ?? false, message: data.message ?? null } })
    return toDonation(created)
  },

  async getAggregates() {
    const agg = await prisma.donation.aggregate({
      _sum: { amount: true },
      _count: true,
    })
    const recent = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      where: { anonymous: false },
    })
    return {
      totalAmount: agg._sum.amount ?? 0,
      totalCount: agg._count,
      recentDonors: recent.map(toDonation),
    }
  },
}
