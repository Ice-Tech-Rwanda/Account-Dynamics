import { prisma } from "@/lib/prisma";
import { blogPostSchema, blogPostUpdateSchema } from "@/lib/validation";
import {
  createListHandler,
  createCreateHandler,
} from "@/lib/admin/api-registry";

const config = {
  name: "BlogPost",
  createSchema: blogPostSchema,
  updateSchema: blogPostUpdateSchema,
  requiredRole: "ADMIN" as const,
  searchFields: ["title", "slug", "excerpt", "category"],
  orderBy: [{ featured: "desc" }, { displayOrder: "asc" }] as Record<string, string>[],
  contentTags: ["blog"],
  filterParams: ["status"],
  hideArchivedByDefault: true,
};

export const GET = createListHandler(prisma.blogPost, config);
export const POST = createCreateHandler(prisma.blogPost, config);