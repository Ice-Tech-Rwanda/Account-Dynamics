import { z } from "zod"

export interface Ranking {
  id: string
  playerName: string
  playerId: string
  rank: number
  rating: number
  gamesPlayed: number
  wins: number
  losses: number
  winRate: number
  avatar?: string
  badge?: string
  region?: string
  title?: string
}

export interface RatingHistoryPoint {
  month: string
  rating: number
}

export interface TournamentStanding {
  id: string
  tournamentName: string
  date: string
  position: number
  totalPlayers: number
  points: number
  prize?: string
}

export interface PlayerProfile {
  id: string
  name: string
  avatar: string
  title: string
  region: string
  rating: number
  rank: number
  gamesPlayed: number
  wins: number
  losses: number
  winRate: number
  bestWord: string
  bestScore: number
  totalTournaments: number
  titles: string[]
  ratingHistory: RatingHistoryPoint[]
  tournamentHistory: TournamentStanding[]
  achievements: { id: string; title: string; date: string; icon: string }[]
}

export const rankingSchema = z.object({
  memberId: z.string().min(1),
  rank: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().default(0),
  gamesPlayed: z.coerce.number().int().default(0),
  wins: z.coerce.number().int().default(0),
  losses: z.coerce.number().int().default(0),
  winRate: z.coerce.number().default(0),
  badge: z.string().optional(),
})
