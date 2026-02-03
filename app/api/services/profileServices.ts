import { AuthUser } from "@/lib/auth/protect";
import { ErrorUnknown } from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
import { prisma } from "@/lib/backend/prisma";
import { Customer } from "@/prisma/generated/prisma/client";

export async function getOrCreateProfile(
  userId: string,
  userData: AuthUser,
): Promise<Customer> {
  logger.info({ userId }, "Getting or creating profile");
  try {
    let profile = await prisma.customer.findUnique({
      where: { id: userId },
    });
    if (profile) return profile;
    profile = await prisma.customer.create({
      data: {
        id: userId,
        email: userData.email || null,
        fullName: userData.name || null,
      },
    });
    logger.info({ userId }, "Profile created");
    return profile;
  } catch (error: any) {
    logger.error({ error, userId }, "Error in getOrCreateProfile");
    throw new ErrorUnknown();
  }
}

export async function updateProfile(
  userId: string,
  data: {
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
    companyName?: string;
    taxId?: string;
    gstIn?: string;
    website?: string;
    notes?: string;
  },
): Promise<Customer> {
  logger.info({ userId }, "Updating profile");
  try {
    const profile = await prisma.customer.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
        companyName: data.companyName,
        taxId: data.taxId,
        gstIn: data.gstIn,
        website: data.website,
        notes: data.notes,
      },
    });
    logger.info({ userId }, "Profile updated successfully");
    return profile;
  } catch (error: any) {
    logger.error({ error, userId }, "Error updating profile");
    throw new ErrorUnknown(); // Re-throw other errors
  }
}
