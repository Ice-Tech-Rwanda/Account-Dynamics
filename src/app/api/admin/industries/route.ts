import { prisma } from "@/lib/prisma";
import { industrySchema, industryUpdateSchema } from "@/lib/validation";
import {
  createListHandler,
  createCreateHandler,
  createGetHandler,
  createUpdateHandler,
  createDeleteHandler,
} from "@/lib/admin/api-registry";

const config = {
  name: "Industry",
  createSchema: industrySchema,
  updateSchema: industryUpdateSchema,
  requiredRole: "ADMIN" as const,
  searchFields: ["name", "slug", "description"],
  orderBy: { displayOrder: "asc" },
  contentTags: ["industries"],
};

export const GET = createListHandler(prisma.industry, config);
export const POST = createCreateHandler(prisma.industry, config);
