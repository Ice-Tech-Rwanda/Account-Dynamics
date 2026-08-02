import { NextRequest } from "next/server"
import { contentService } from "@/domains/content/service.server"
import { ok, notFound, serverError } from "@/lib/api-helpers"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")
    if (section) {
      const item = await contentService.getSection(section)
      if (!item) return notFound("Section not found")
      return ok(item.content)
    }
    const map = await contentService.getAllSections()
    return ok(map)
  } catch (error) {
    logger.error("Failed to fetch site content", { error: String(error) })
    return serverError()
  }
}
