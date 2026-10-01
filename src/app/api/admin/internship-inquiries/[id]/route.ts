import { prisma } from "@/lib/prisma";
import { internshipInquirySchema, internshipInquiryUpdateSchema } from "@/lib/validation";
import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/admin/api-registry";

const config = {
  name: "InternshipInquiry",
  createSchema: internshipInquirySchema,
  updateSchema: internshipInquiryUpdateSchema,
  requiredRole: "ADMIN" as const,
  include: { assignedTo: { select: { id: true, name: true, email: true } } },
  contentTags: ["internship-inquiries"],
};

export const GET = createGetHandler(prisma.internshipInquiry, config);
export const PATCH = createUpdateHandler(prisma.internshipInquiry, config);
export const DELETE = createDeleteHandler(prisma.internshipInquiry, config);
