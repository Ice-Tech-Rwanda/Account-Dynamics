import { prisma } from "@/lib/prisma";
import { serviceSchema, serviceUpdateSchema } from "@/lib/validation";
import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/admin/api-registry";

const config = {
  name: "Service",
  createSchema: serviceSchema,
  updateSchema: serviceUpdateSchema,
  requiredRole: "ADMIN" as const,
  contentTags: ["services"],
  include: {
    category: true,
    benefits: { orderBy: { displayOrder: "asc" } },
  },
};

export const GET = createGetHandler(prisma.service, config);
export const PUT = createUpdateHandler(prisma.service, config);
export const DELETE = createDeleteHandler(prisma.service, config);
