import { GstSlab } from "@/prisma/generated/prisma/enums";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GST_SLAB_PERCENT_MAP: Record<GstSlab, number> = {
  ZERO_PERCENT: 0,
  FIVE_PERCENT: 5,
  TWELVE_PERCENT: 12,
  EIGHTEEN_PERCENT: 18,
  TWENTY_EIGHT_PERCENT: 28,
  FORTY_PERCENT: 40,
} as const;
