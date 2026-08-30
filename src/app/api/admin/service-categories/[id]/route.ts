import { prisma } from "@/lib/prisma";
import { serviceCategorySchema, serviceCategoryUpdateSchema } from "@/lib/validation";
import {
  createGetHandler,
  createUpdateHandler,
  createDeleteHandler,
} from "@/lib/admin/api-registry";

const config = {
  name: "ServiceCategory",
  createSchema: serviceCategorySchema,
  updateSchema: serviceCategoryUpdateSchema,
  requiredRole: "ADMIN" as const,
  contentTags: ["services"],
  include: {
    services: {
      orderBy: { displayOrder: "asc" },
      include: { benefits: { orderBy: { displayOrder: "asc" } } },
    },
  },
};

export const GET = createGetHandler(prisma.serviceCategory, config);
export const PUT = createUpdateHandler(prisma.serviceCategory, config);
export const DELETE = createDeleteHandler(prisma.serviceCategory, config);
