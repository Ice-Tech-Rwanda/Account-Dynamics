import { z } from "zod";

export const emailSchema = z.string().email("Invalid email address").max(255);

export const slugSchema = z.string().max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format").optional();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof paginationSchema>;

export function parsePagination(params: URLSearchParams): Pagination {
  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "20", 10);
  return {
    page: isNaN(page) || page < 1 ? 1 : Math.min(page, 10000),
    limit: isNaN(limit) || limit < 1 ? 20 : Math.min(limit, 100),
  };
}

// ---------------------------------------------------------------------------
// Public form schemas
// ---------------------------------------------------------------------------

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: emailSchema,
  subject: z.string().min(1, "Subject is required").max(300),
  message: z.string().min(1, "Message is required").max(5000),
});

export const quoteSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: emailSchema,
  phone: z.string().max(50).nullable().optional(),
  company: z.string().max(200).nullable().optional(),
  service: z.string().max(200).nullable().optional(),
  businessType: z.string().max(200).nullable().optional(),
  message: z.string().max(5000).nullable().optional(),
  preferredContact: z.enum(["email", "phone"]).default("email"),
});

export const bookingSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: emailSchema,
  phone: z.string().max(50).nullable().optional(),
  service: z.string().min(1, "Service is required").max(200),
  date: z.string().max(20).nullable().optional(),
  time: z.string().max(20).nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

export const newsletterSchema = z.object({
  email: emailSchema,
});

export const settingsSchema = z.record(z.string(), z.string());

// ---------------------------------------------------------------------------
// Admin content schemas (for admin API validation)
// ---------------------------------------------------------------------------

export const serviceCategorySchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  icon: z.string().max(100).default("Building2"),
  image: z.string().max(500).nullable().optional(),
  cta: z.string().max(200).default("Talk to an Accountant"),
  seoTitle: z.string().max(200).nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
  displayOrder: z.number().int().default(0),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("PUBLISHED"),
});

export const serviceCategoryUpdateSchema = serviceCategorySchema.partial();

export const serviceSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  description: z.string().min(1).max(5000),
  shortDescription: z.string().max(500).nullable().optional(),
  icon: z.string().max(100).default("Briefcase"),
  image: z.string().max(500).nullable().optional(),
  ctaLabel: z.string().max(200).default("Request a Consultation"),
  ctaUrl: z.string().max(500).default("/contact"),
  seoTitle: z.string().max(200).nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("PUBLISHED"),
  benefits: z.array(z.string().max(500)).optional(),
});

export const serviceUpdateSchema = serviceSchema.partial();

export const teamMemberSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  bio: z.string().max(2000).nullable().optional(),
  photo: z.string().max(500).nullable().optional(),
  email: z.string().email().max(255).nullable().optional(),
  linkedin: z.string().max(500).nullable().optional(),
  expertise: z.array(z.string().max(200)).default([]),
  isFounder: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("PUBLISHED"),
});

export const teamMemberUpdateSchema = teamMemberSchema.partial();

export const industrySchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  description: z.string().min(1).max(2000),
  icon: z.string().max(100).default("Building2"),
  image: z.string().max(500).nullable().optional(),
  services: z.array(z.string().max(200)).default([]),
  displayOrder: z.number().int().default(0),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("PUBLISHED"),
});

export const industryUpdateSchema = industrySchema.partial();

export const faqSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(5000),
  category: z.string().max(100).default("General"),
  displayOrder: z.number().int().default(0),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("PUBLISHED"),
});

export const faqUpdateSchema = faqSchema.partial();

export const testimonialSchema = z.object({
  clientName: z.string().min(1).max(200),
  company: z.string().max(200).nullable().optional(),
  position: z.string().max(200).nullable().optional(),
  content: z.string().min(1).max(5000),
  photo: z.string().max(500).nullable().optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  displayOrder: z.number().int().default(0),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("DRAFT"),
});

export const testimonialUpdateSchema = testimonialSchema.partial();

export const softwareToolSchema = z.object({
  name: z.string().min(1).max(200),
  logo: z.string().max(500).nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
  websiteUrl: z.string().url().max(500).nullable().optional(),
  displayOrder: z.number().int().default(0),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("PUBLISHED"),
});

export const softwareToolUpdateSchema = softwareToolSchema.partial();

export const homepageSectionSchema = z.object({
  eyebrow: z.string().max(200).nullable().optional(),
  title: z.string().max(300).nullable().optional(),
  subtitle: z.string().max(500).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  items: z.array(z.object({ icon: z.string(), title: z.string(), description: z.string() })).nullable().optional(),
  imageKey: z.string().max(200).nullable().optional(),
  ctaLabel: z.string().max(200).nullable().optional(),
  ctaUrl: z.string().max(500).nullable().optional(),
});

export const seoSettingSchema = z.object({
  title: z.string().max(200).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  ogImage: z.string().max(500).nullable().optional(),
  canonicalUrl: z.string().max(500).nullable().optional(),
  indexable: z.boolean().default(true),
});

export const userCreateSchema = z.object({
  name: z.string().min(1).max(200),
  email: emailSchema,
  password: z.string().min(8).max(200),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]).default("EDITOR"),
  phone: z.string().max(50).nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: emailSchema.optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]).optional(),
  active: z.boolean().optional(),
  phone: z.string().max(50).nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
});
