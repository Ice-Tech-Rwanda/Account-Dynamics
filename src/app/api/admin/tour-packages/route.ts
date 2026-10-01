import { prisma } from "@/lib/prisma";
import { tourPackageSchema, tourPackageUpdateSchema } from "@/lib/validation";
import {
  createListHandler,
  createCreateHandler,
} from "@/lib/admin/api-registry";

const config = {
  name: "TourPackage",
  createSchema: tourPackageSchema,
  updateSchema: tourPackageUpdateSchema,
  requiredRole: "ADMIN" as const,
  searchFields: ["title", "slug", "location", "overview"],
  orderBy: { displayOrder: "asc" },
  contentTags: ["packages"],
  filterParams: ["status"],
  hideArchivedByDefault: true,
};

export const GET = createListHandler(prisma.tourPackage, config);
export const POST = createCreateHandler(prisma.tourPackage, config);
