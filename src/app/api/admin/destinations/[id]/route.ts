import { prisma } from "@/lib/prisma";
import { destinationSchema, destinationUpdateSchema } from "@/lib/validation";
import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/admin/api-registry";

const config = {
  name: "Destination",
  createSchema: destinationSchema,
  updateSchema: destinationUpdateSchema,
  requiredRole: "ADMIN" as const,
  contentTags: ["destinations"],
};

export const GET = createGetHandler(prisma.destination, config);
export const PATCH = createUpdateHandler(prisma.destination, config);
export const DELETE = createDeleteHandler(prisma.destination, config);
