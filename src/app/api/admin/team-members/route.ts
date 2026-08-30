import { prisma } from "@/lib/prisma";
import { teamMemberSchema, teamMemberUpdateSchema } from "@/lib/validation";
import {
  createListHandler,
  createCreateHandler,
  createGetHandler,
  createUpdateHandler,
  createDeleteHandler,
} from "@/lib/admin/api-registry";

const config = {
  name: "TeamMember",
  createSchema: teamMemberSchema,
  updateSchema: teamMemberUpdateSchema,
  requiredRole: "ADMIN" as const,
  searchFields: ["name", "role", "bio"],
  orderBy: { displayOrder: "asc" },
  contentTags: ["team"],
};

export const GET = createListHandler(prisma.teamMember, config);
export const POST = createCreateHandler(prisma.teamMember, config);
