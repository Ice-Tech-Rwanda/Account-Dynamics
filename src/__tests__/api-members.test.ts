import { prisma } from "@/lib/prisma"

// Integration tests for Members API
// Run with: npx jest --testPathPattern=api-members

describe("Members API Integration", () => {
  const testMember = {
    name: "Test Member",
    email: `test-${Date.now()}@example.com`,
    phone: "+250788000000",
    category: "individual",
  }

  let createdId: string

  afterAll(async () => {
    if (createdId) {
      await prisma.member.delete({ where: { id: createdId } }).catch(() => {})
    }
    await prisma.$disconnect()
  })

  it("creates a member via Prisma directly", async () => {
    const member = await prisma.member.create({
      data: testMember,
    })
    expect(member.id).toBeDefined()
    expect(member.name).toBe(testMember.name)
    expect(member.email).toBe(testMember.email)
    expect(member.status).toBe("active")
    createdId = member.id
  })

  it("reads the created member", async () => {
    const member = await prisma.member.findUnique({ where: { id: createdId } })
    expect(member).not.toBeNull()
    expect(member!.name).toBe(testMember.name)
  })

  it("updates the member", async () => {
    const updated = await prisma.member.update({
      where: { id: createdId },
      data: { rating: 1500, gamesPlayed: 10 },
    })
    expect(updated.rating).toBe(1500)
    expect(updated.gamesPlayed).toBe(10)
  })

  it("lists members with pagination", async () => {
    const members = await prisma.member.findMany({
      skip: 0,
      take: 20,
      orderBy: { createdAt: "desc" },
    })
    expect(Array.isArray(members)).toBe(true)
    expect(members.length).toBeGreaterThan(0)
  })

  it("prevents duplicate email", async () => {
    await expect(
      prisma.member.create({
        data: testMember,
      })
    ).rejects.toThrow()
  })

  it("deletes the member", async () => {
    await prisma.member.delete({ where: { id: createdId } })
    const gone = await prisma.member.findUnique({ where: { id: createdId } })
    expect(gone).toBeNull()
    createdId = ""
  })

  it("returns null for non-existent member", async () => {
    const member = await prisma.member.findUnique({ where: { id: "nonexistent-id" } })
    expect(member).toBeNull()
  })
})
