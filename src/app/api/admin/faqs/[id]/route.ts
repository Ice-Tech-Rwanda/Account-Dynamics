import { prisma } from "@/lib/prisma";
import { faqSchema, faqUpdateSchema } from "@/lib/validation";
import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/admin/api-registry";

const config = {
  name: "FaqItem",
  createSchema: faqSchema,
  updateSchema: faqUpdateSchema,
  requiredRole: "ADMIN" as const,
  contentTags: ["faqs"],
};

export const GET = createGetHandler(prisma.faqItem, config);
export const PUT = createUpdateHandler(prisma.faqItem, config);
export const DELETE = createDeleteHandler(prisma.faqItem, config);
