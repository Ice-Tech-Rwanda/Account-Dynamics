import { prisma } from "@/lib/prisma";
import { destinationSchema, destinationUpdateSchema } from "@/lib/validation";
import {
  createListHandler,
  createCreateHandler,
} from "@/lib/admin/api-registry";

const config = {
  name: "Destination",
  createSchema: destinationSchema,
  updateSchema: destinationUpdateSchema,
  requiredRole: "ADMIN" as const,
  searchFields: ["name", "slug", "shortDescription"],
  orderBy: { displayOrder: "asc" },
  contentTags: ["destinations"],
  filterParams: ["status"],
  hideArchivedByDefault: true,
};

export const GET = createListHandler(prisma.destination, config);
export const POST = createCreateHandler(prisma.destination, config);
