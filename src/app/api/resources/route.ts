import { NextRequest } from "next/server"
import { resourcesService } from "@/domains/resources/service.server"
import { ok, created, serverError, parseParams } from "@/lib/api-helpers"
import { resourceSchema } from "@/lib/validation"
import { slugify } from "@/lib/utils"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get("page") ?? "1", 10) || 1
    const limit = parseInt(searchParams.get("limit") ?? "12", 10) || 12
    const result = await resourcesService.list({ page, limit })
    return ok(result)
  } catch (error) {
    logger.error("Failed to fetch resources", { error: String(error) })
    return serverError()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseParams(resourceSchema, body)
    if (!parsed.success) return parsed.error
    const data = {
      ...parsed.data,
      slug: parsed.data.slug ?? slugify(parsed.data.title),
      publishedAt: parsed.data.published ? new Date() : null,
    }
    const resource = await prisma.article.create({ data: data as any })
    return created(resource)
  } catch (error) {
    logger.error("Failed to create resource", { error: String(error) })
    return serverError()
  }
}
