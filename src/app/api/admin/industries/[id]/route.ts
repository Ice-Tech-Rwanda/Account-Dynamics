import { prisma } from "@/lib/prisma";
import { industrySchema, industryUpdateSchema } from "@/lib/validation";
import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/admin/api-registry";

const config = {
  name: "Industry",
  createSchema: industrySchema,
  updateSchema: industryUpdateSchema,
  requiredRole: "ADMIN" as const,
  contentTags: ["industries"],
};

export const GET = createGetHandler(prisma.industry, config);
export const PATCH = createUpdateHandler(prisma.industry, config);
export const DELETE = createDeleteHandler(prisma.industry, config);
