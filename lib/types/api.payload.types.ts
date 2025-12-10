import type { Image, Product, Review, Variant } from "@prisma/client";

// API response interfaces
export interface SuccessRes<T> {
  data?: T;
  success: boolean;
}

export type VariantWithReviewImg = Variant & {
  images: Image[];
  reviews: Review[];
};

// Product and Variant types
export type ProductWithVariantsImagesReviews = Product & {
  variants: VariantWithReviewImg[];
};

export type VariantWithProductImgReview = Variant & {
  product: Product;
  images: Image[];
  reviews: Review[];
};
