import { ProductCategory } from "@prisma/client";
import { z } from "zod";

export const ProductFiltersQuerySchema = z.object({
  category: z.enum(ProductCategory).optional(),
  search: z.string().optional(),
});

export type ProductFiltersQuery = z.infer<typeof ProductFiltersQuerySchema>;
