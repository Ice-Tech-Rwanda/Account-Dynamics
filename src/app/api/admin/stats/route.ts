import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, serverError, unauthorized } from "@/lib/api-helpers"
import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"

function getMonthLabel(d: Date, offset: number): string {
  const date = new Date(d)
  date.setMonth(date.getMonth() + offset)
  return date.toLocaleString("en-US", { month: "short" })
}

function monthsAgo(n: number): Date {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function GET(_request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") return unauthorized()

    const sixMonthsAgo = monthsAgo(6)

    const [
      memberCount,
      eventCount,
      productCount,
      donationAgg,
      recentMembers,
      recentDonations,
      allDonations,
      allMembers,
      allEvents,
      recentMembersList,
      recentDonationsList,
      recentEventsList,
      recentOrdersList,
      recentGalleryList,
      recentRankings,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.event.count(),
      prisma.product.count(),
      prisma.donation.aggregate({ _sum: { amount: true } }),
      prisma.member.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.donation.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.donation.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { amount: true, createdAt: true },
      }),
      prisma.member.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
      prisma.event.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { startDate: true, createdAt: true },
      }),
      prisma.member.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { name: true, createdAt: true },
      }),
      prisma.donation.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { donorName: true, amount: true, createdAt: true },
      }),
      prisma.event.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { title: true, status: true, createdAt: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 2,
        select: { id: true, customerName: true, total: true, createdAt: true },
      }),
      prisma.galleryItem.findMany({
        orderBy: { createdAt: "desc" },
        take: 2,
        select: { title: true, createdAt: true },
      }),
      prisma.ranking.findMany({
        orderBy: { updatedAt: "desc" },
        take: 2,
        select: { id: true, updatedAt: true },
      }),
    ])

    const now = new Date()
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const label = getMonthLabel(now, i - 5)
      const start = monthsAgo(5 - i)
      const end = new Date(start)
      end.setMonth(end.getMonth() + 1)

      const revenue = allDonations
        .filter((d) => {
          const t = new Date(d.createdAt)
          return t >= start && t < end
        })
        .reduce((sum, d) => sum + d.amount, 0)

      const members = allMembers.filter((m) => {
        const t = new Date(m.createdAt)
        return t >= start && t < end
      }).length

      const events = allEvents.filter((e) => {
        const t = new Date(e.createdAt)
        return t >= start && t < end
      }).length

      return { month: label, members, events, revenue }
    })

    const activityEntries: {
      action: string
      detail: string
      time: string
      type: string
    }[] = []

    recentMembersList.forEach((m) => {
      activityEntries.push({
        action: "New member registered",
        detail: `${m.name} registered`,
        time: timeAgo(m.createdAt),
        type: "member",
      })
    })

    recentDonationsList.forEach((d) => {
      activityEntries.push({
        action: "Donation received",
        detail: `$${d.amount.toLocaleString()} from ${d.donorName}`,
        time: timeAgo(d.createdAt),
        type: "donation",
      })
    })

    recentEventsList.forEach((e) => {
      activityEntries.push({
        action: `Event ${e.status === "upcoming" ? "created" : "updated"}`,
        detail: e.title,
        time: timeAgo(e.createdAt),
        type: "event",
      })
    })

    recentOrdersList.forEach((o) => {
      activityEntries.push({
        action: "Order placed",
        detail: `#${o.id.slice(0, 6)} — ${o.customerName}`,
        time: timeAgo(o.createdAt),
        type: "order",
      })
    })

    recentGalleryList.forEach((g) => {
      activityEntries.push({
        action: "Gallery updated",
        detail: g.title,
        time: timeAgo(g.createdAt),
        type: "gallery",
      })
    })

    recentRankings.forEach((r) => {
      activityEntries.push({
        action: "Ranking updated",
        detail: "Rankings updated",
        time: timeAgo(r.updatedAt),
        type: "ranking",
      })
    })

    activityEntries.sort((a, b) => parseTimeAgo(a.time) - parseTimeAgo(b.time))

    return ok({
      stats: {
        totalMembers: memberCount,
        upcomingEvents: eventCount,
        productsSold: productCount,
        totalDonations: donationAgg._sum.amount ?? 0,
      },
      recentMembers: recentMembers.map((m) => ({
        name: m.name,
        email: m.email,
        date: m.createdAt.toISOString(),
      })),
      recentDonations: recentDonations.map((d) => ({
        name: d.donorName,
        amount: d.amount,
        date: d.createdAt.toISOString(),
      })),
      monthlyData,
      activities: activityEntries.slice(0, 8),
    })
  } catch (error) {
    logger.error("Failed to fetch stats", { error: String(error) })
    return serverError()
  }
}

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`
}

function parseTimeAgo(time: string): number {
  if (time === "Just now") return 0
  const num = parseInt(time)
  if (time.includes("min")) return num
  if (time.includes("hour")) return num * 60
  if (time.includes("day")) return num * 1440
  return num * 43200
}
