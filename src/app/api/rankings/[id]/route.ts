import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, notFound, serverError, parseParams } from "@/lib/api-helpers"
import { rankingUpdateSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const ranking = await prisma.ranking.findUnique({ where: { id } })
    if (!ranking) return notFound()
    return ok(ranking)
  } catch (error) {
    logger.error("Failed to fetch ranking", { error: String(error) })
    return serverError()
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const body = await request.json()
    const parsed = parseParams(rankingUpdateSchema, body)
    if (!parsed.success) return parsed.error
    const existing = await prisma.ranking.findUnique({ where: { id } })
    if (!existing) return notFound()
    const ranking = await prisma.ranking.update({ where: { id }, data: parsed.data })
    return ok(ranking)
  } catch (error) {
    logger.error("Failed to update ranking", { error: String(error) })
    return serverError()
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const existing = await prisma.ranking.findUnique({ where: { id } })
    if (!existing) return notFound()
    await prisma.ranking.delete({ where: { id } })
    return ok({ success: true })
  } catch (error) {
    logger.error("Failed to delete ranking", { error: String(error) })
    return serverError()
  }
}
