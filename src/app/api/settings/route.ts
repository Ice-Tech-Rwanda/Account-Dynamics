import { prisma } from "@/lib/prisma"
import { ok, serverError, unauthorized, parseParams } from "@/lib/api-helpers"
import { settingsSchema } from "@/lib/validation"
import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    const settings = await prisma.setting.findMany()
    const map: Record<string, string> = {}
    for (const s of settings) map[s.key] = s.value
    return ok(map)
  } catch (error) {
    logger.error("Failed to fetch settings", { error: String(error) })
    return serverError()
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") return unauthorized()

    const body = await request.json()
    const parsed = parseParams(settingsSchema, body)
    if (!parsed.success) return parsed.error

    const entries = Object.entries(parsed.data) as [string, string][]
    for (const [key, value] of entries) {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
    return ok({ success: true })
  } catch (error) {
    logger.error("Failed to save settings", { error: String(error) })
    return serverError()
  }
}
