import { prisma } from "@/lib/prisma";
import { testimonialSchema, testimonialUpdateSchema } from "@/lib/validation";
import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/admin/api-registry";

const config = {
  name: "Testimonial",
  createSchema: testimonialSchema,
  updateSchema: testimonialUpdateSchema,
  requiredRole: "ADMIN" as const,
  contentTags: ["homepage"],
};

export const GET = createGetHandler(prisma.testimonial, config);
export const PUT = createUpdateHandler(prisma.testimonial, config);
export const DELETE = createDeleteHandler(prisma.testimonial, config);
