import { z } from "zod";
import { generateSignedToken } from "@/lib/uploads/signer";

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export function generateProductImageToken(filename: string, expiresIn = 300) {
  return generateSignedToken(`product-img:${filename}`, expiresIn);
}
