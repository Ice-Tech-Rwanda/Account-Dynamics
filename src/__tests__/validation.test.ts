import { describe, it, expect } from "vitest";
import {
  contactSchema,
  newsletterSchema,
  internshipInquirySchema,
  internshipInquiryUpdateSchema,
  tripInquirySchema,
  serviceCategorySchema,
  serviceSchema,
  teamMemberSchema,
  industrySchema,
  faqSchema,
  homepageSectionSchema,
  seoSettingSchema,
  blogPostSchema,
  blogPostUpdateSchema,
  userCreateSchema,
  userUpdateSchema,
} from "@/lib/validation";

describe("Contact Schema", () => {
  it("accepts valid contact data", () => {
    const result = contactSchema.safeParse({
      name: "John Smith",
      email: "john@example.com",
      subject: "Safari enquiry",
      message: "We would like to plan a gorilla trekking trip in July.",
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

  it("accepts structured contact fields and an idempotency key", () => {
    const result = contactSchema.safeParse({
      name: "John Smith",
      email: "john@example.com",
      subject: "Service: Gorilla Trekking",
      message: "Hello",
      phone: "416-555-0100",
      company: "Acme Inc",
      service: "Gorilla Trekking",
      idempotencyKey: "a1b2c3d4e5f6g7h8i9j0k1l2m3",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed idempotency key", () => {
    const result = contactSchema.safeParse({
      name: "John",
      email: "john@example.com",
      subject: "Test",
      message: "Hello",
      idempotencyKey: "../etc/passwd",
    });
    expect(result.success).toBe(false);
  });
});

describe("Internship Inquiry Schema", () => {
  it("accepts a minimal valid application", () => {
    const result = internshipInquirySchema.safeParse({
      name: "Aline Uwase",
      email: "aline@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("requires name and email", () => {
    expect(internshipInquirySchema.safeParse({ email: "a@example.com" }).success).toBe(false);
    expect(internshipInquirySchema.safeParse({ name: "A" }).success).toBe(false);
    expect(internshipInquirySchema.safeParse({ name: "A", email: "not-an-email" }).success).toBe(false);
  });

  it("accepts the full internship-specific field set", () => {
    const result = internshipInquirySchema.safeParse({
      name: "Eric Habimana",
      email: "eric@example.com",
      phone: "+250788000000",
      university: "University of Rwanda",
      fieldOfStudy: "Tourism Management",
      programType: "INDUSTRIAL_ATTACHMENT",
      preferredStartDate: "2026-03-01",
      duration: "3 months",
      areasOfInterest: "Safari guiding, Hospitality",
      message: "Keen to join the gorilla trekking team.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown programType", () => {
    const result = internshipInquirySchema.safeParse({
      name: "Eric",
      email: "eric@example.com",
      programType: "NIGHT_SCHOOL",
    });
    expect(result.success).toBe(false);
  });

  it("update schema accepts lead-tracking fields only", () => {
    expect(
      internshipInquiryUpdateSchema.safeParse({ status: "IN_PROGRESS", read: true, archived: false })
        .success
    ).toBe(true);
    expect(internshipInquiryUpdateSchema.safeParse({ status: "ARCHIVED" }).success).toBe(false);
  });

  it("keeps trip inquiries a distinct shape", () => {
    // The two public forms must not drift into one another.
    const tripFields = new Set(Object.keys(tripInquirySchema.shape));
    const internshipFields = new Set(Object.keys(internshipInquirySchema.shape));
    expect(internshipFields.has("university")).toBe(true);
    expect(tripFields.has("university")).toBe(false);
    expect(tripFields.has("preferredPackage")).toBe(true);
    expect(internshipFields.has("preferredPackage")).toBe(false);
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
      name: "Chimpanzee Trekking",
      slug: "chimpanzee-trekking",
      description: "Guided chimpanzee tracking in Nyungwe",
    });
    expect(result.success).toBe(true);
  });

  it("requires categoryId", () => {
    const result = serviceSchema.safeParse({
      name: "Chimpanzee Trekking",
      slug: "chimpanzee-trekking",
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
      answer: "We offer gorilla trekking, wildlife safaris and cultural tours across Rwanda.",
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

describe("Contact Inquiry Schema", () => {
  it("requires subject and message", () => {
    const result = contactSchema.safeParse({
      name: "Grace Mukamana",
      email: "grace@example.com",
      subject: "Gorilla trekking enquiry",
      message: "We would like to visit in July.",
    });
    expect(result.success).toBe(true);
    expect(contactSchema.safeParse({ name: "G", email: "g@example.com" }).success).toBe(false);
  });

  it("is distinct from the trip inquiry form", () => {
    const contactFields = new Set(Object.keys(contactSchema.shape));
    const tripFields = new Set(Object.keys(tripInquirySchema.shape));
    expect(contactFields.has("subject")).toBe(true);
    expect(tripFields.has("subject")).toBe(false);
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
      title: "Home | Global Line Safaris",
      description: "Rwanda safari tours and travel",
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
      password: "Str0ngPassw0rd123!",
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

describe("Blog Post Schema", () => {
  it("accepts valid blog post", () => {
    const result = blogPostSchema.safeParse({
      title: "How to Plan Your Rwanda Gorilla Trekking Permit",
      slug: "how-to-plan-rwanda-gorilla-trekking-permit",
      content: "Paragraph one.\n\nParagraph two.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid slug format", () => {
    const result = blogPostSchema.safeParse({
      title: "Bad Slug",
      slug: "Bad Slug Format",
    });
    expect(result.success).toBe(false);
  });

  it("defaults category to Travel Guides", () => {
    const result = blogPostSchema.safeParse({
      title: "A Weekend at Lake Kivu",
      slug: "weekend-at-lake-kivu",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.category).toBe("Travel Guides");
      expect(result.data.status).toBe("PUBLISHED");
      expect(result.data.excerpt).toBe("");
    }
  });

  it("accepts full metadata fields", () => {
    const result = blogPostSchema.safeParse({
      title: "Akagera Big Five",
      slug: "akagera-big-five",
      excerpt: "A wild ridge",
      content: "Body text.",
      category: "Safari & Wildlife",
      image: "/gls/gallery/gallery_1787759216_3cf27fb4.jpg",
      author: "Raymond Shumbusho",
      readTime: 5,
      seoTitle: "Akagera Big Five | Global Line Safaris",
      seoDescription: "Discover Akagera.",
      featured: true,
      displayOrder: 2,
      status: "PUBLISHED",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a readTime of zero", () => {
    const result = blogPostSchema.safeParse({
      title: "Test",
      slug: "test",
      readTime: 0,
    });
    expect(result.success).toBe(false);
  });

  it("accepts partial updates", () => {
    const result = blogPostUpdateSchema.safeParse({ title: "New Title" });
    expect(result.success).toBe(true);
  });

  it("accepts empty update", () => {
    const result = blogPostUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
