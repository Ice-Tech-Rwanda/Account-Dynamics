import { prisma } from "@/lib/prisma"
import type { LoginInput, AuthResult } from "./domain"

export const authService = {
  async validateLogin(input: LoginInput): Promise<AuthResult> {
    const user = await prisma.user.findUnique({ where: { email: input.email } })
    if (!user) return { success: false, error: "Invalid email or password" }
    return { success: true }
  },

  async checkEmailAvailability(email: string): Promise<boolean> {
    const existing = await prisma.user.findUnique({ where: { email } })
    return !existing
  },
}
