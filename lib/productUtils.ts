// Shared product transformation utilities to avoid duplication across the codebase
// Keep these pure and free of framework-specific logic so they can be used
// in both server and client code without circular dependencies.

import type { Product } from "@/types/product";

export const mapCategoryToUI = (category: string): string => {
  const categoryMap: Record<string, string> = {
    ESSENTIAL_OIL: "essential-oil",
    FIXED_OIL: "fixed-oil",
    EXTRACT: "extract",
    HYDROSOL: "hydrosol",
    HERBAL_OILS: "herbal-oils",
    CHEMICALS: "chemicals",
  };
  return (
    categoryMap[category] || (category || "").toLowerCase().replace("_", "-")
  );
};

export const generateINCI = (product: any): string => {
  if (!product) return "";
  if (product.botanicalName) {
    return product.botanicalName;
  }
  // Fallback to name if no botanical name
  return product.name || "";
};

export const generateApplications = (product: any): string => {
  if (!product) return "Various cosmetic applications";
  if (product.variants && product.variants.length > 0) {
    const applications = product.variants
      .map((variant: any) => variant.usage || variant.description || "")
      .filter((app: string) => app && app.length > 0)
      .join(", ");
    return applications || "Various cosmetic applications";
  }
  return "Various cosmetic applications";
};

// Serialize Prisma Decimal objects to plain numbers for client compatibility
export const serializeProductData = (data: any): any => {
  if (!data) return data;
  const serialized = JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (
        typeof value === "object" &&
        value !== null &&
        value.constructor.name === "Decimal"
      ) {
        return Number(value);
      }
      return value;
    })
  );
  return serialized;
};

export const transformDbProductToProduct = (dbProduct: any): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  category: mapCategoryToUI(dbProduct.category),
  description: dbProduct.description || "",
  inci: generateINCI(dbProduct),
  applications: generateApplications(dbProduct),
  // pass-through optional fields for richer product pages
  variants: dbProduct.variants,
  botanicalName: dbProduct.botanicalName,
  supplier: dbProduct.supplier,
  certifications: dbProduct.certifications,
  storageConditions: dbProduct.storageConditions,
});
