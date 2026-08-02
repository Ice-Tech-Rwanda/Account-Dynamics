import { NextRequest } from "next/server"
import { membersService } from "@/domains/members/service.server"
import { ok, created, serverError, parseParams } from "@/lib/api-helpers"
import { memberSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get("page") ?? "1", 10) || 1
    const limit = parseInt(searchParams.get("limit") ?? "20", 10) || 20
    const category = searchParams.get("category") ?? undefined
    const status = searchParams.get("status") ?? undefined
    const result = await membersService.list({ page, limit, category, status })
    return ok(result)
  } catch (error) {
    logger.error("Failed to fetch members", { error: String(error) })
    return serverError()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseParams(memberSchema, body)
    if (!parsed.success) return parsed.error
    const member = await prisma.member.create({ data: parsed.data })
    return created(member)
  } catch (error) {
    logger.error("Failed to create member", { error: String(error) })
    return serverError()
  }
}
