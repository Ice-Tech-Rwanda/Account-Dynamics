import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, created, serverError, badRequest, parseParams, requireAdmin, unauthorized } from "@/lib/api-helpers"
import { teamMemberSchema, parsePagination } from "@/lib/validation"
import { logger } from "@/lib/logger"
import { validateOrigin } from "@/lib/csrf"
import { isAllowed } from "@/lib/localRateLimiter"
import type { Session } from "next-auth"

function isSession(session: Session | NextResponse): session is Session {
  return !!(session && "user" in session)
}

export async function GET(request: NextRequest) {
  try {
    // require admin for accessing team list in admin area
    const session = await requireAdmin()
    if (!session) return unauthorized()

    const { searchParams } = request.nextUrl
    const { page, limit } = parsePagination(searchParams)
    const skip = (page - 1) * limit
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'anon'
    if (!isAllowed(`team-list:${ip}`)) return badRequest('Rate limit exceeded')

    const [members, total] = await Promise.all([
      prisma.teamMember.findMany({ orderBy: { order: "asc" }, skip, take: limit }),
      prisma.teamMember.count(),
    ])
    const data = members.map((m) => ({ ...m, socialLinks: m.socialLinks ? JSON.parse(m.socialLinks) : null }))
    return ok({ data, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    logger.error("Failed to fetch team members", { error: String(error) })
    return serverError()
  }
}

export async function POST(request: Request) {
  try {
    const originCheck = validateOrigin(request as unknown as Request)
    if (!originCheck.ok) return badRequest(originCheck.reason)

    const session = await requireAdmin()
    if (!isSession(session)) return session

    const body = await request.json()
    const parsed = parseParams(teamMemberSchema, body)
    if (!parsed.success) return parsed.error
    const data = {
      ...parsed.data,
      socialLinks: parsed.data.socialLinks ? JSON.stringify(parsed.data.socialLinks) : null,
    }
    const member = await prisma.teamMember.create({ data: data as any })
    await prisma.auditLog.create({ data: { userId: session.user.id, action: 'team:create', entity: 'TeamMember', entityId: member.id, details: JSON.stringify(parsed.data) } })
    return created({ ...member, socialLinks: member.socialLinks ? JSON.parse(member.socialLinks) : null })
  } catch (error) {
    logger.error("Failed to create team member", { error: String(error) })
    return serverError()
  }
}
