import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, notFound, serverError, badRequest, parseParams, requireAdmin } from "@/lib/api-helpers"
import { teamMemberUpdateSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"
import { validateOrigin } from "@/lib/csrf"
import type { Session } from "next-auth"

function isSession(session: Session | NextResponse): session is Session {
  return !!(session && "user" in session)
}

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const session = await requireAdmin()
    if (!isSession(session)) return session

    const member = await prisma.teamMember.findUnique({ where: { id } })
    if (!member) return notFound()
    return ok({ ...member, socialLinks: member.socialLinks ? JSON.parse(member.socialLinks) : null })
  } catch (error) {
    logger.error("Failed to fetch team member", { error: String(error) })
    return serverError()
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const originCheck = validateOrigin(request as unknown as Request)
    if (!originCheck.ok) return badRequest(originCheck.reason)

    const session = await requireAdmin()
    if (!isSession(session)) return session

    const body = await request.json()
    const parsed = parseParams(teamMemberUpdateSchema, body)
    if (!parsed.success) return parsed.error
    const existing = await prisma.teamMember.findUnique({ where: { id } })
    if (!existing) return notFound()
    const data: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.socialLinks) data.socialLinks = JSON.stringify(parsed.data.socialLinks)
    const member = await prisma.teamMember.update({ where: { id }, data })
    await prisma.auditLog.create({ data: { userId: session.user.id, action: 'team:update', entity: 'TeamMember', entityId: id, details: JSON.stringify(parsed.data) } })
    return ok({ ...member, socialLinks: member.socialLinks ? JSON.parse(member.socialLinks) : null })
  } catch (error) {
    logger.error("Failed to update team member", { error: String(error) })
    return serverError()
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const session = await requireAdmin()
    if (!isSession(session)) return session

    const existing = await prisma.teamMember.findUnique({ where: { id } })
    if (!existing) return notFound()
    await prisma.teamMember.delete({ where: { id } })
    await prisma.auditLog.create({ data: { userId: session.user.id, action: 'team:delete', entity: 'TeamMember', entityId: id } })
    return ok({ success: true })
  } catch (error) {
    logger.error("Failed to delete team member", { error: String(error) })
    return serverError()
  }
}
