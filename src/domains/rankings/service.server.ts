import { prisma } from "@/lib/prisma"
import type { Ranking, PlayerProfile } from "./domain"

export const rankingsService = {
  async list(params: { page?: number; limit?: number } = {}) {
    const { page = 1, limit = 20 } = params
    const skip = (page - 1) * limit

    const [rows, total] = await Promise.all([
      prisma.ranking.findMany({
        orderBy: { rank: "asc" },
        skip,
        take: limit,
        include: { member: { select: { name: true, id: true } } },
      }),
      prisma.ranking.count(),
    ])
    const data = rows.map((r): Ranking => ({
      id: r.id,
      playerName: r.member?.name ?? "Unknown Player",
      playerId: r.memberId,
      rank: r.rank,
      rating: r.rating,
      gamesPlayed: r.gamesPlayed,
      wins: r.wins,
      losses: r.losses,
      winRate: r.winRate,
      badge: r.badge ?? undefined,
    }))
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async getRankings(limit = 200) {
    const rows = await prisma.ranking.findMany({
      orderBy: { rank: "asc" },
      take: limit,
      include: { member: true },
    })
    return rows.map((r): Ranking => ({
      id: r.id,
      playerId: r.memberId,
      playerName: r.member?.name ?? "Unknown",
      rank: r.rank,
      rating: r.rating,
      gamesPlayed: r.gamesPlayed,
      wins: r.wins,
      losses: r.losses,
      winRate: Math.round(r.winRate ?? 0),
      avatar: "/team/placeholder.jpg",
      badge: r.badge ?? undefined,
    }))
  },

  async getProfiles(limit = 100) {
    const rows = await prisma.playerProfile.findMany({
      take: limit,
      include: { member: true },
      orderBy: { updatedAt: "desc" },
    })
    return rows.map((p): PlayerProfile => ({
      id: p.id,
      name: p.member?.name ?? "Player",
      avatar: "/team/placeholder.jpg",
      title: p.member?.category ?? "",
      region: p.member?.phone ?? "",
      rating: p.member?.rating ?? 0,
      rank: 0,
      gamesPlayed: p.member?.gamesPlayed ?? 0,
      wins: p.member?.wins ?? 0,
      losses: p.member?.gamesPlayed && p.member?.wins ? (p.member.gamesPlayed - (p.member.wins ?? 0)) : 0,
      winRate: p.member?.gamesPlayed ? Math.round(((p.member?.wins ?? 0) / Math.max(1, p.member.gamesPlayed)) * 100) : 0,
      bestWord: p.bestWord ?? "",
      bestScore: p.bestScore ?? 0,
      totalTournaments: p.totalTournaments ?? 0,
      titles: JSON.parse(p.titles || "[]"),
      ratingHistory: JSON.parse(p.ratingHistory || "[]"),
      tournamentHistory: JSON.parse(p.tournamentHistory || "[]"),
      achievements: JSON.parse(p.achievements || "[]"),
    }))
  },

  async getPlayerDetail(id: string) {
    const [profile, member] = await Promise.all([
      prisma.playerProfile.findUnique({ where: { id }, include: { member: true } }),
      prisma.member.findUnique({ where: { id }, include: { ranking: true, playerProfile: true } }),
    ])
    return { profile, member }
  },

  async getPlayerProfile(memberId: string) {
    const profile = await prisma.playerProfile.findUnique({
      where: { memberId },
      include: { member: { select: { name: true } } },
    })
    if (!profile) return null
    const memberName = (profile as any).member?.name ?? "Unknown"
    const titles: string[] = JSON.parse(profile.titles)
    const ratingHistory = JSON.parse(profile.ratingHistory)
    const tournamentHistory = JSON.parse(profile.tournamentHistory)
    const achievements = JSON.parse(profile.achievements)
    return {
      id: profile.id, name: memberName, avatar: "/team/placeholder.jpg",
      title: "", region: "", rating: 0, rank: 0,
      gamesPlayed: 0, wins: 0, losses: 0, winRate: 0,
      bestWord: profile.bestWord ?? "", bestScore: profile.bestScore ?? 0,
      totalTournaments: profile.totalTournaments,
      titles, ratingHistory, tournamentHistory, achievements,
    } satisfies PlayerProfile
  },
}
