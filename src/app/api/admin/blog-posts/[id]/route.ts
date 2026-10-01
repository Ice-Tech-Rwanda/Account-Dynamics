import { prisma } from "@/lib/prisma";
import { blogPostSchema, blogPostUpdateSchema } from "@/lib/validation";
import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/admin/api-registry";

const config = {
  name: "BlogPost",
  createSchema: blogPostSchema,
  updateSchema: blogPostUpdateSchema,
  requiredRole: "ADMIN" as const,
  contentTags: ["blog"],
};

export const GET = createGetHandler(prisma.blogPost, config);
export const PATCH = createUpdateHandler(prisma.blogPost, config);
export const DELETE = createDeleteHandler(prisma.blogPost, config);