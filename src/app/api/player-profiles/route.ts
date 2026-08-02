import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, serverError } from "@/lib/api-helpers"
import { parsePagination } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit } = parsePagination(searchParams)
    const skip = (page - 1) * limit
    const [profiles, total] = await Promise.all([
      prisma.playerProfile.findMany({
        include: { member: { select: { name: true } } },
        orderBy: { totalTournaments: "desc" },
        skip,
        take: limit,
      }),
      prisma.playerProfile.count(),
    ])
    const data = profiles.map((p) => ({
      ...p,
      titles: JSON.parse(p.titles),
      ratingHistory: JSON.parse(p.ratingHistory),
      tournamentHistory: JSON.parse(p.tournamentHistory),
      achievements: JSON.parse(p.achievements),
    }))
    return ok({ data, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    logger.error("Failed to fetch player profiles", { error: String(error) })
    return serverError()
  }
}
