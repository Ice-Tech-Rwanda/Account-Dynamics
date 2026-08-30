import { describe, it, expect } from "vitest";
import {
  contactSchema,
  quoteSchema,
  bookingSchema,
  newsletterSchema,
  serviceCategorySchema,
  serviceSchema,
  teamMemberSchema,
  industrySchema,
  faqSchema,
  testimonialSchema,
  softwareToolSchema,
  homepageSectionSchema,
  seoSettingSchema,
  userCreateSchema,
  userUpdateSchema,
} from "@/lib/validation";

describe("Contact Schema", () => {
  it("accepts valid contact data", () => {
    const result = contactSchema.safeParse({
      name: "John Smith",
      email: "john@example.com",
      subject: "General Inquiry",
      message: "I need help with tax preparation.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = contactSchema.safeParse({ name: "", email: "", subject: "", message: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({
      name: "John",
      email: "not-an-email",
      subject: "Test",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });
});

describe("Quote Schema", () => {
  it("accepts valid quote data", () => {
    const result = quoteSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      service: "Tax Preparation",
      preferredContact: "email",
    });
    expect(result.success).toBe(true);
  });

  it("defaults preferredContact to email", () => {
    const result = quoteSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.preferredContact).toBe("email");
    }
  });

  it("rejects invalid preferredContact", () => {
    const result = quoteSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      preferredContact: "sms",
    });
    expect(result.success).toBe(false);
  });
});

describe("Booking Schema", () => {
  it("accepts valid booking data", () => {
    const result = bookingSchema.safeParse({
      name: "Bob Wilson",
      email: "bob@example.com",
      service: "Tax Advisory",
    });
    expect(result.success).toBe(true);
  });

  it("requires name and email", () => {
    const result = bookingSchema.safeParse({ email: "bob@example.com" });
    expect(result.success).toBe(false);
  });
});

describe("Newsletter Schema", () => {
  it("accepts valid email", () => {
    const result = newsletterSchema.safeParse({ email: "subscriber@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = newsletterSchema.safeParse({ email: "invalid" });
    expect(result.success).toBe(false);
  });
});

describe("Service Category Schema", () => {
  it("accepts valid category", () => {
    const result = serviceCategorySchema.safeParse({
      slug: "small-business",
      title: "Small Business",
      description: "Services for small businesses",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid slug format", () => {
    const result = serviceCategorySchema.safeParse({
      slug: "Invalid Slug!",
      title: "Test",
      description: "Test",
    });
    expect(result.success).toBe(false);
  });

  it("defaults status to PUBLISHED", () => {
    const result = serviceCategorySchema.safeParse({
      slug: "test",
      title: "Test",
      description: "Test",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("PUBLISHED");
    }
  });
});

describe("Service Schema", () => {
  it("accepts valid service", () => {
    const result = serviceSchema.safeParse({
      categoryId: "cat-123",
      name: "Bookkeeping",
      slug: "bookkeeping",
      description: "Daily bookkeeping services",
    });
    expect(result.success).toBe(true);
  });

  it("requires categoryId", () => {
    const result = serviceSchema.safeParse({
      name: "Bookkeeping",
      slug: "bookkeeping",
      description: "Daily bookkeeping",
    });
    expect(result.success).toBe(false);
  });
});

describe("Team Member Schema", () => {
  it("accepts valid member", () => {
    const result = teamMemberSchema.safeParse({
      name: "Joseph Mathews",
      role: "Founder",
    });
    expect(result.success).toBe(true);
  });

  it("requires name and role", () => {
    const result = teamMemberSchema.safeParse({ name: "Joseph" });
    expect(result.success).toBe(false);
  });
});

describe("Industry Schema", () => {
  it("accepts valid industry", () => {
    const result = industrySchema.safeParse({
      name: "Small Business",
      slug: "small-business",
      description: "Accounting for small businesses",
    });
    expect(result.success).toBe(true);
  });
});

describe("FAQ Schema", () => {
  it("accepts valid FAQ", () => {
    const result = faqSchema.safeParse({
      question: "What services do you offer?",
      answer: "We offer accounting, tax and advisory services.",
    });
    expect(result.success).toBe(true);
  });

  it("defaults category to General", () => {
    const result = faqSchema.safeParse({
      question: "Test?",
      answer: "Test answer",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.category).toBe("General");
    }
  });
});

describe("Testimonial Schema", () => {
  it("accepts valid testimonial", () => {
    const result = testimonialSchema.safeParse({
      clientName: "Happy Client",
      content: "Great service!",
    });
    expect(result.success).toBe(true);
  });

  it("defaults status to DRAFT", () => {
    const result = testimonialSchema.safeParse({
      clientName: "Client",
      content: "Good",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("DRAFT");
    }
  });
});

describe("Homepage Section Schema", () => {
  it("accepts valid section data", () => {
    const result = homepageSectionSchema.safeParse({
      eyebrow: "Our Services",
      title: "What We Offer",
      subtitle: "Professional services",
    });
    expect(result.success).toBe(true);
  });

  it("accepts items array", () => {
    const result = homepageSectionSchema.safeParse({
      items: [
        { icon: "Check", title: "Item 1", description: "Desc 1" },
      ],
    });
    expect(result.success).toBe(true);
  });
});

describe("SEO Setting Schema", () => {
  it("accepts valid SEO data", () => {
    const result = seoSettingSchema.safeParse({
      title: "Home | Account Dynamics",
      description: "Accounting services in Toronto",
      indexable: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("User Create Schema", () => {
  it("accepts valid user data", () => {
    const result = userCreateSchema.safeParse({
      name: "Admin User",
      email: "admin@example.com",
      password: "securepassword123",
    });
    expect(result.success).toBe(true);
  });

  it("requires minimum password length", () => {
    const result = userCreateSchema.safeParse({
      name: "Admin",
      email: "admin@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("defaults role to EDITOR", () => {
    const result = userCreateSchema.safeParse({
      name: "User",
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe("EDITOR");
    }
  });
});

describe("User Update Schema", () => {
  it("accepts partial updates", () => {
    const result = userUpdateSchema.safeParse({ name: "New Name" });
    expect(result.success).toBe(true);
  });

  it("accepts empty update", () => {
    const result = userUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
