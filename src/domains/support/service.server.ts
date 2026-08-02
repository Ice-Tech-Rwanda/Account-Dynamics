import { prisma } from "@/lib/prisma"
import type { SponsorshipPackage, Donor, DonationSummary } from "./domain"

export const supportService = {
  async getDonationSummary(): Promise<DonationSummary> {
    const total = await prisma.donation.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    })
    const count = await prisma.donation.count({ where: { status: "completed" } })
    const recent = await prisma.donation.findMany({
      where: { anonymous: false, status: "completed" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { donorName: true, amount: true, createdAt: true },
    })
    return {
      totalRaised: total._sum.amount ?? 0,
      donorCount: count,
      recentDonors: recent.map((r) => ({ donorName: r.donorName, amount: r.amount, createdAt: r.createdAt.toISOString() })),
    }
  },

  async getSponsorshipPackages(): Promise<SponsorshipPackage[]> {
    const packages = await prisma.sponsorshipPackage.findMany({
      orderBy: { order: "asc" },
    })
    return packages.map((p: { id: string; name: string; price: number; description: string; benefits: string; popular: boolean; order: number }) => ({
      id: p.id, name: p.name, price: p.price, description: p.description,
      benefits: JSON.parse(p.benefits), popular: p.popular, order: p.order,
    }))
  },

  async getDonors(): Promise<Donor[]> {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
    })
    return donations.map((d) => ({
      id: d.id,
      donorName: d.donorName,
      amount: d.amount,
      anonymous: d.anonymous,
    }))
  },
}
