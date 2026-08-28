import { prisma } from "@/lib/prisma"

describe("Events API Integration", () => {
  const testEvent = {
    title: `Test Event ${Date.now()}`,
    slug: `test-event-${Date.now()}`,
    description: "Integration test event description",
    category: "seminar",
    startDate: new Date("2026-07-01"),
    location: "Toronto",
    status: "upcoming",
  }

  let createdId: string

  afterAll(async () => {
    if (createdId) {
      await prisma.event.delete({ where: { id: createdId } }).catch(() => {})
    }
    await prisma.$disconnect()
  })

  it("creates an event", async () => {
    const event = await prisma.event.create({ data: testEvent })
    expect(event.id).toBeDefined()
    expect(event.title).toBe(testEvent.title)
    expect(event.slug).toBe(testEvent.slug)
    expect(event.status).toBe("upcoming")
    createdId = event.id
  })

  it("reads the created event", async () => {
    const event = await prisma.event.findUnique({ where: { id: createdId } })
    expect(event).not.toBeNull()
    expect(event!.title).toBe(testEvent.title)
  })

  it("enforces unique slug", async () => {
    await expect(
      prisma.event.create({
        data: { ...testEvent, title: "Another Event" },
      })
    ).rejects.toThrow()
  })

  it("updates event status", async () => {
    const updated = await prisma.event.update({
      where: { id: createdId },
      data: { status: "ongoing" },
    })
    expect(updated.status).toBe("ongoing")
  })

  it("lists events ordered by start date", async () => {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "desc" },
      take: 10,
    })
    expect(events.length).toBeGreaterThan(0)
  })

  it("registers a participant for the event", async () => {
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: createdId,
        name: "Participant One",
        email: `participant-${Date.now()}@example.com`,
      },
    })
    expect(registration.id).toBeDefined()
    expect(registration.eventId).toBe(createdId)

    // Cleanup
    await prisma.eventRegistration.delete({ where: { id: registration.id } })
  })

  it("deletes the event", async () => {
    await prisma.event.delete({ where: { id: createdId } })
    const gone = await prisma.event.findUnique({ where: { id: createdId } })
    expect(gone).toBeNull()
    createdId = ""
  })
})
