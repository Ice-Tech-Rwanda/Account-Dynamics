import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

describe("Authentication Flow", () => {
  const testEmail = `admin-test-${Date.now()}@example.com`
  const testPassword = "SecurePass123!"

  beforeAll(async () => {
    // Create a test admin user directly
    const hashedPassword = await bcrypt.hash(testPassword, 12)
    await prisma.user.create({
      data: {
        email: testEmail,
        name: "Test Admin",
        password: hashedPassword,
        role: "admin",
      },
    })
  })

  afterAll(async () => {
    await prisma.user.delete({ where: { email: testEmail } }).catch(() => {})
    await prisma.$disconnect()
  })

  it("creates user with hashed password", async () => {
    const user = await prisma.user.findUnique({ where: { email: testEmail } })
    expect(user).not.toBeNull()
    expect(user!.password).not.toBe(testPassword)
    expect(user!.role).toBe("admin")
  })

  it("verifies password correctly", async () => {
    const user = await prisma.user.findUnique({ where: { email: testEmail } })
    const isValid = await bcrypt.compare(testPassword, user!.password!)
    expect(isValid).toBe(true)
  })

  it("rejects wrong password", async () => {
    const user = await prisma.user.findUnique({ where: { email: testEmail } })
    const isValid = await bcrypt.compare("wrong-password", user!.password!)
    expect(isValid).toBe(false)
  })

  it("prevents duplicate email", async () => {
    const hashedPassword = await bcrypt.hash(testPassword, 12)
    await expect(
      prisma.user.create({
        data: {
          email: testEmail,
          name: "Duplicate",
          password: hashedPassword,
        },
      })
    ).rejects.toThrow()
  })

  it("creates a session record", async () => {
    const user = await prisma.user.findUnique({ where: { email: testEmail } })
    const session = await prisma.session.create({
      data: {
        sessionToken: `session-${Date.now()}`,
        userId: user!.id,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })
    expect(session.id).toBeDefined()
    expect(session.userId).toBe(user!.id)

    // Cleanup
    await prisma.session.delete({ where: { id: session.id } })
  })

  it("supports user update", async () => {
    const updated = await prisma.user.update({
      where: { email: testEmail },
      data: { name: "Updated Admin" },
    })
    expect(updated.name).toBe("Updated Admin")
  })

  it("supports account linking", async () => {
    const user = await prisma.user.findUnique({ where: { email: testEmail } })
    const account = await prisma.account.create({
      data: {
        userId: user!.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: user!.id,
      },
    })
    expect(account.id).toBeDefined()
    await prisma.account.delete({ where: { id: account.id } })
  })
})
