import { prisma } from "@/lib/prisma";
import { tripInquirySchema, tripInquiryUpdateSchema } from "@/lib/validation";
import { createListHandler, createCreateHandler } from "@/lib/admin/api-registry";

const config = {
  name: "TripInquiry",
  createSchema: tripInquirySchema,
  updateSchema: tripInquiryUpdateSchema,
  requiredRole: "ADMIN" as const,
  searchFields: ["name", "email", "phone", "preferredPackage", "destination"],
  orderBy: { createdAt: "desc" },
  include: { assignedTo: { select: { id: true, name: true, email: true } } },
  contentTags: ["trip-inquiries"],
  filterParams: ["status", "read", "archived"],
  filterDefaults: { archived: "false" },
  includeStatusCounts: true,
};

export const GET = createListHandler(prisma.tripInquiry, config);
export const POST = createCreateHandler(prisma.tripInquiry, config);
