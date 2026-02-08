/**
 * Application Categories Data
 * ===========================
 * Contains all application category definitions used in the applications page.
 */

export enum ApplicationCategory {
  HAIR = "Hair",
  FACE = "Face",
  BODY = "Body",
  TRADITIONAL = "Traditional",
  CLEAN = "Clean",
  MEN = "Men",
  SENSITIVE = "Sensitive",
  PROBLEM = "Problem",
  BRIGHTENING = "Brightening",
  WELLNESS = "Wellness",
  LUXURY = "Luxury",
  ORAL = "Oral",
}

export interface Application {
  title: string;
  category: ApplicationCategory;
  description: string;
  ingredients: string[];
  icon: string;
}

/**
 * Re-export constants that may be needed elsewhere
 */
export { PRODUCT_CATEGORY_DESCRIPTIONS, PRODUCT_CATEGORY_LABELS } from "./index";
