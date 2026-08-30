import { prisma } from "@/lib/prisma";
import { serviceCategorySchema, serviceCategoryUpdateSchema } from "@/lib/validation";
import {
  createListHandler,
  createCreateHandler,
  createGetHandler,
  createUpdateHandler,
  createDeleteHandler,
} from "@/lib/admin/api-registry";

const config = {
  name: "ServiceCategory",
  createSchema: serviceCategorySchema,
  updateSchema: serviceCategoryUpdateSchema,
  requiredRole: "ADMIN" as const,
  searchFields: ["title", "slug", "description"],
  orderBy: { displayOrder: "asc" },
  contentTags: ["services"],
  include: {
    services: {
      orderBy: { displayOrder: "asc" },
      include: { benefits: { orderBy: { displayOrder: "asc" } } },
    },
  },
};

export const GET = createListHandler(prisma.serviceCategory, config);
export const POST = createCreateHandler(prisma.serviceCategory, config);
