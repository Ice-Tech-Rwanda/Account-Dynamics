import { memberSchema, eventSchema, rankingSchema, productSchema, orderSchema, partnerSchema, donationSchema, teamMemberSchema, contactSchema, newsletterSchema, paginationSchema } from "@/lib/validation"

describe("paginationSchema", () => {
  it("defaults to page 1, limit 20", () => {
    const result = paginationSchema.parse({})
    expect(result.page).toBe(1)
    expect(result.limit).toBe(20)
  })

  it("accepts valid pagination params", () => {
    const result = paginationSchema.parse({ page: "3", limit: "50" })
    expect(result.page).toBe(3)
    expect(result.limit).toBe(50)
  })

  it("rejects limit over 100", () => {
    const result = paginationSchema.safeParse({ page: "1", limit: "200" })
    expect(result.success).toBe(false)
  })
})

describe("memberSchema", () => {
  it("validates a complete member", () => {
    const result = memberSchema.parse({
      name: "John Doe",
      email: "john@example.com",
    })
    expect(result.name).toBe("John Doe")
    expect(result.email).toBe("john@example.com")
    expect(result.status).toBe("active")
  })

  it("rejects missing name", () => {
    const result = memberSchema.safeParse({ email: "john@example.com" })
    expect(result.success).toBe(false)
  })

  it("rejects invalid email", () => {
    const result = memberSchema.safeParse({ name: "John", email: "not-an-email" })
    expect(result.success).toBe(false)
  })

  it("rejects empty name", () => {
    const result = memberSchema.safeParse({ name: "", email: "john@example.com" })
    expect(result.success).toBe(false)
  })
})

describe("eventSchema", () => {
  const validEvent = {
    title: "Test Event",
    description: "A test event description",
    category: "tournament",
    startDate: "2026-06-15",
    location: "Kigali",
  }

  it("validates a complete event", () => {
    const result = eventSchema.parse(validEvent)
    expect(result.title).toBe("Test Event")
    expect(result.status).toBe("upcoming")
  })

  it("rejects missing title", () => {
    const result = eventSchema.safeParse({ ...validEvent, title: "" })
    expect(result.success).toBe(false)
  })

  it("rejects missing category", () => {
    const result = eventSchema.safeParse({ ...validEvent, category: "" })
    expect(result.success).toBe(false)
  })

  it("rejects missing location", () => {
    const result = eventSchema.safeParse({ ...validEvent, location: "" })
    expect(result.success).toBe(false)
  })
})

describe("rankingSchema", () => {
  it("validates a complete ranking", () => {
    const result = rankingSchema.parse({
      memberId: "cm123",
      rank: 1,
    })
    expect(result.memberId).toBe("cm123")
    expect(result.rank).toBe(1)
    expect(result.rating).toBe(0)
  })

  it("rejects negative rank", () => {
    const result = rankingSchema.safeParse({ memberId: "cm123", rank: -1 })
    expect(result.success).toBe(false)
  })

  it("rejects missing memberId", () => {
    const result = rankingSchema.safeParse({ rank: 1 })
    expect(result.success).toBe(false)
  })
})

describe("productSchema", () => {
  it("validates a complete product", () => {
    const result = productSchema.parse({
      name: "Scrabble Board",
      description: "Official Scrabble board",
      price: 25000,
      category: "equipment",
    })
    expect(result.name).toBe("Scrabble Board")
    expect(result.price).toBe(25000)
  })

  it("rejects negative price", () => {
    const result = productSchema.safeParse({
      name: "Test",
      description: "Test",
      price: -100,
      category: "equipment",
    })
    expect(result.success).toBe(false)
  })

  it("rejects zero price", () => {
    const result = productSchema.safeParse({
      name: "Test",
      description: "Test",
      price: 0,
      category: "equipment",
    })
    expect(result.success).toBe(false)
  })
})

describe("orderSchema", () => {
  it("validates a complete order", () => {
    const result = orderSchema.parse({
      total: 50000,
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
    })
    expect(result.total).toBe(50000)
    expect(result.status).toBe("pending")
  })

  it("rejects invalid email", () => {
    const result = orderSchema.safeParse({
      total: 50000,
      customerName: "Jane",
      customerEmail: "bad",
    })
    expect(result.success).toBe(false)
  })
})

describe("contactSchema", () => {
  it("validates a complete contact message", () => {
    const result = contactSchema.parse({
      name: "Jane",
      email: "jane@example.com",
      subject: "Hello",
      message: "This is a test message",
    })
    expect(result.name).toBe("Jane")
  })

  it("rejects missing subject", () => {
    const result = contactSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      subject: "",
      message: "Test",
    })
    expect(result.success).toBe(false)
  })

  it("rejects empty message", () => {
    const result = contactSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      subject: "Hello",
      message: "",
    })
    expect(result.success).toBe(false)
  })
})

describe("newsletterSchema", () => {
  it("validates a valid email", () => {
    const result = newsletterSchema.parse({ email: "test@example.com" })
    expect(result.email).toBe("test@example.com")
  })

  it("rejects invalid email", () => {
    const result = newsletterSchema.safeParse({ email: "not-email" })
    expect(result.success).toBe(false)
  })
})

describe("donationSchema", () => {
  it("validates a complete donation", () => {
    const result = donationSchema.parse({
      donorName: "Alice",
      donorEmail: "alice@example.com",
      amount: 10000,
    })
    expect(result.amount).toBe(10000)
    expect(result.anonymous).toBe(false)
  })

  it("rejects negative amount", () => {
    const result = donationSchema.safeParse({
      donorName: "Alice",
      donorEmail: "alice@example.com",
      amount: -100,
    })
    expect(result.success).toBe(false)
  })
})

describe("teamMemberSchema", () => {
  it("validates a complete team member", () => {
    const result = teamMemberSchema.parse({
      name: "Coach Bob",
      role: "Head Coach",
    })
    expect(result.name).toBe("Coach Bob")
    expect(result.bio).toBe("")
  })
})

describe("partnerSchema", () => {
  it("validates a complete partner", () => {
    const result = partnerSchema.parse({
      name: "ACME Corp",
      description: "A partner company",
      type: "sponsor",
    })
    expect(result.name).toBe("ACME Corp")
    expect(result.active).toBe(true)
  })
})
