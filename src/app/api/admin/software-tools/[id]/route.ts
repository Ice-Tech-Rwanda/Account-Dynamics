import { prisma } from "@/lib/prisma";
import { softwareToolSchema, softwareToolUpdateSchema } from "@/lib/validation";
import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/admin/api-registry";

const config = {
  name: "SoftwareTool",
  createSchema: softwareToolSchema,
  updateSchema: softwareToolUpdateSchema,
  requiredRole: "ADMIN" as const,
  contentTags: ["software"],
};

export const GET = createGetHandler(prisma.softwareTool, config);
export const PATCH = createUpdateHandler(prisma.softwareTool, config);
export const DELETE = createDeleteHandler(prisma.softwareTool, config);
