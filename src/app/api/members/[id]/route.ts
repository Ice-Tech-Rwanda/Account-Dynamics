import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, notFound, serverError, parseParams } from "@/lib/api-helpers"
import { memberUpdateSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const member = await prisma.member.findUnique({ where: { id } })
    if (!member) return notFound()
    return ok(member)
  } catch (error) {
    logger.error("Failed to fetch member", { error: String(error) })
    return serverError()
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const body = await request.json()
    const parsed = parseParams(memberUpdateSchema, body)
    if (!parsed.success) return parsed.error
    const existing = await prisma.member.findUnique({ where: { id } })
    if (!existing) return notFound()
    const member = await prisma.member.update({ where: { id }, data: parsed.data })
    return ok(member)
  } catch (error) {
    logger.error("Failed to update member", { error: String(error) })
    return serverError()
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const existing = await prisma.member.findUnique({ where: { id } })
    if (!existing) return notFound()
    await prisma.member.delete({ where: { id } })
    return ok({ success: true })
  } catch (error) {
    logger.error("Failed to delete member", { error: String(error) })
    return serverError()
  }
}
