// Shared product transformation utilities to avoid duplication across the codebase
// Keep these pure and free of framework-specific logic so they can be used
// in both server and client code without circular dependencies.

import { ProductWithVariantsImages } from "@/types/product";

export const generateINCI = (product: ProductWithVariantsImages): string => {
  if (!product) return "";
  if (product.botanicalName) {
    return product.botanicalName;
  }
  // Fallback to name if no botanical name
  return product.name || "";
};

export const generateApplications = (product: ProductWithVariantsImages): string[] => {
  const usage = [];
  if (product.collections && product.collections.length > 0) {
    const applications = product.collections.map((c) => c.collection.name);
    usage.push(...applications);
  } else {
    usage.push("Various applications");
  }
  return usage;
};

// Serialize Prisma Decimal objects to plain numbers for client compatibility
export const serializeProductData = (data: any): any => {
  if (!data) return data;
  const serialized = JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "object" && value !== null && value.constructor.name === "Decimal") {
        return Number(value);
      }
      return value;
    }),
  );
  return serialized;
};
