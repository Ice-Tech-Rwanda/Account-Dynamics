import { prisma } from "@/lib/prisma";
import { faqSchema, faqUpdateSchema } from "@/lib/validation";
import {
  createListHandler,
  createCreateHandler,
  createGetHandler,
  createUpdateHandler,
  createDeleteHandler,
} from "@/lib/admin/api-registry";

const config = {
  name: "FaqItem",
  createSchema: faqSchema,
  updateSchema: faqUpdateSchema,
  requiredRole: "ADMIN" as const,
  searchFields: ["question", "answer", "category"],
  orderBy: { displayOrder: "asc" },
  contentTags: ["faqs"],
};

export const GET = createListHandler(prisma.faqItem, config);
export const POST = createCreateHandler(prisma.faqItem, config);
