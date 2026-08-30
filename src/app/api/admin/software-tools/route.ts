import { prisma } from "@/lib/prisma";
import { softwareToolSchema, softwareToolUpdateSchema } from "@/lib/validation";
import {
  createListHandler,
  createCreateHandler,
  createGetHandler,
  createUpdateHandler,
  createDeleteHandler,
} from "@/lib/admin/api-registry";

const config = {
  name: "SoftwareTool",
  createSchema: softwareToolSchema,
  updateSchema: softwareToolUpdateSchema,
  requiredRole: "ADMIN" as const,
  searchFields: ["name", "description"],
  orderBy: { displayOrder: "asc" },
  contentTags: ["software"],
};

export const GET = createListHandler(prisma.softwareTool, config);
export const POST = createCreateHandler(prisma.softwareTool, config);
