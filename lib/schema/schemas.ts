import { CertificationType, ExtractionMethod, HazardClass, ProductCategory } from "@prisma/client";
import { z } from "zod";

export const UpdateProfileReqSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
  gstIn: z.string().optional(),
  website: z.url("Invalid website URL").optional(),
  notes: z.string().optional(),
});

export const UpdateProductReqSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  category: z.enum(ProductCategory).optional(),
  description: z.string().optional(),
  botanicalName: z.string().optional(),
  extractionMethod: z.enum(ExtractionMethod).optional(),
  chemicalFormula: z.string().optional(),
  casNumber: z.string().optional(),
  hazardClass: z.enum(HazardClass).optional(),
  supplier: z.string().optional(),
  certifications: z.array(z.enum(CertificationType)).optional(),
  storageConditions: z.string().optional(),
});

export const ProductFiltersQuerySchema = z.object({
  category: z.enum(ProductCategory).optional(),
  search: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

export type ProductFiltersQuery = z.infer<typeof ProductFiltersQuerySchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileReqSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductReqSchema>;
