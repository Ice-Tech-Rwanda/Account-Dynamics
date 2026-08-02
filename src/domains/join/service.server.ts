import { prisma } from "@/lib/prisma"
import type { MembershipPlan, VolunteerRole } from "./domain"

export const joinService = {
  async getMembershipPlans(): Promise<MembershipPlan[]> {
    const rows = await prisma.setting.findMany({
      where: { key: { startsWith: "membership_" } },
    })
    return rows.map((r) => JSON.parse(r.value)) as MembershipPlan[]
  },

  async getVolunteerRoles(): Promise<VolunteerRole[]> {
    const row = await prisma.siteContent.findUnique({
      where: { section: "volunteerRoles" },
    })
    return row ? (JSON.parse(row.content) as VolunteerRole[]) : []
  },
}
