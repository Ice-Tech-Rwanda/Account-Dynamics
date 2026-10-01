import { prisma } from "@/lib/prisma";
import { tripInquirySchema, tripInquiryUpdateSchema } from "@/lib/validation";
import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/admin/api-registry";

const config = {
  name: "TripInquiry",
  createSchema: tripInquirySchema,
  updateSchema: tripInquiryUpdateSchema,
  requiredRole: "ADMIN" as const,
  include: { assignedTo: { select: { id: true, name: true, email: true } } },
  contentTags: ["trip-inquiries"],
};

export const GET = createGetHandler(prisma.tripInquiry, config);
export const PATCH = createUpdateHandler(prisma.tripInquiry, config);
export const DELETE = createDeleteHandler(prisma.tripInquiry, config);
