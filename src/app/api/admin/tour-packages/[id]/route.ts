import { prisma } from "@/lib/prisma";
import { tourPackageSchema, tourPackageUpdateSchema } from "@/lib/validation";
import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/admin/api-registry";

const config = {
  name: "TourPackage",
  createSchema: tourPackageSchema,
  updateSchema: tourPackageUpdateSchema,
  requiredRole: "ADMIN" as const,
  contentTags: ["packages"],
};

export const GET = createGetHandler(prisma.tourPackage, config);
export const PATCH = createUpdateHandler(prisma.tourPackage, config);
export const DELETE = createDeleteHandler(prisma.tourPackage, config);
