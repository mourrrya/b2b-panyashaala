import { ProductCategory } from "@prisma/client";
import { z } from "zod";

export const ProductFiltersQuerySchema = z.object({
  category: z.enum(ProductCategory).optional(),
  search: z.string().optional(),
  usage: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12),
  ids: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      if (Array.isArray(val)) return val;
      return val.split(",").filter(Boolean);
    }),
});

/** Input type for calling getProducts directly (page/limit are optional) */
export type ProductFiltersInput = z.input<typeof ProductFiltersQuerySchema>;
