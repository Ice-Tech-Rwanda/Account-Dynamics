import { prisma } from "@/lib/prisma";
import { testimonialSchema, testimonialUpdateSchema } from "@/lib/validation";
import {
  createListHandler,
  createCreateHandler,
  createGetHandler,
  createUpdateHandler,
  createDeleteHandler,
} from "@/lib/admin/api-registry";

const config = {
  name: "Testimonial",
  createSchema: testimonialSchema,
  updateSchema: testimonialUpdateSchema,
  requiredRole: "ADMIN" as const,
  searchFields: ["clientName", "company", "content"],
  orderBy: { displayOrder: "asc" },
  contentTags: ["homepage"],
};

export const GET = createListHandler(prisma.testimonial, config);
export const POST = createCreateHandler(prisma.testimonial, config);
