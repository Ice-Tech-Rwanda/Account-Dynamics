import { prisma } from "@/lib/prisma";
import { teamMemberSchema, teamMemberUpdateSchema } from "@/lib/validation";
import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/admin/api-registry";

const config = {
  name: "TeamMember",
  createSchema: teamMemberSchema,
  updateSchema: teamMemberUpdateSchema,
  requiredRole: "ADMIN" as const,
  contentTags: ["team"],
};

export const GET = createGetHandler(prisma.teamMember, config);
export const PUT = createUpdateHandler(prisma.teamMember, config);
export const DELETE = createDeleteHandler(prisma.teamMember, config);
