import { prisma } from "@/lib/prisma";
import { internshipInquirySchema, internshipInquiryUpdateSchema } from "@/lib/validation";
import { createListHandler, createCreateHandler } from "@/lib/admin/api-registry";

const config = {
  name: "InternshipInquiry",
  createSchema: internshipInquirySchema,
  updateSchema: internshipInquiryUpdateSchema,
  requiredRole: "ADMIN" as const,
  searchFields: ["name", "email", "phone", "university", "fieldOfStudy", "programType"],
  orderBy: { createdAt: "desc" },
  include: { assignedTo: { select: { id: true, name: true, email: true } } },
  contentTags: ["internship-inquiries"],
  filterParams: ["status", "read", "archived", "programType"],
  filterDefaults: { archived: "false" },
  includeStatusCounts: true,
};

export const GET = createListHandler(prisma.internshipInquiry, config);
export const POST = createCreateHandler(prisma.internshipInquiry, config);
