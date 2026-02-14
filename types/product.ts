// Product-related type definitions
// Extracted to avoid circular imports between store and utils

import { ProductCollection } from "@/prisma/generated/prisma/client";
import { ProductCategory } from "@/prisma/generated/prisma/enums";

export interface Variant {
  id: string;
  variantName: string;
  description?: string;
  size?: string;
  concentration?: string;
  packaging?: string;
  retailPrice: number;
  wholesalePrice: number;
  costPrice: number;
  initialStock: number;
  minStockLevel?: number;
  benefits: string[];
  ingredients: string[];
  usage: string;
  images?: Image[];
  reviews?: Review[];
}

export interface Image {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Product {
  id: string | number; // Support both number (legacy) and string (UUID)
  name: string;
  category: ProductCategory;
  description: string;
  inci: string;
  applications: string;
  // Database-backed fields (optional for backward compatibility)
  variants?: Variant[];
  botanicalName?: string;
  supplier?: string;
  certifications?: string[];
  storageConditions?: string;
}

export interface DbProduct extends Omit<Product, "id"> {
  id: string; // Database products use UUID strings
  variants: Variant[];
}

export type VariantWithReviewImg = Variant & {
  images: Image[];
  reviews: Review[];
};

// Product and Variant types
export type ProductWithVariantsImages = Product & {
  variants: VariantWithReviewImg[];
  collections: {
    collection: ProductCollection;
  }[];
};

export type VariantWithProductImgReview = Variant & {
  product: Product;
  images: Image[];
  reviews: Review[];
};
