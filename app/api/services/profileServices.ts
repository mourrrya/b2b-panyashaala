import { ErrorUnknown } from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
import { prisma } from "@/lib/backend/prisma";
import { Customer } from "@/prisma/generated/prisma/client";

export async function getOrCreateProfile(
  userId: string,
  userData: any,
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
        fullName: userData.user_metadata?.full_name || null,
        phone: userData.phone || userData.user_metadata?.phone || null,
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
  data: { full_name?: string; phone?: string; avatar_url?: string },
): Promise<Customer> {
  logger.info({ userId }, "Updating profile");
  try {
    const profile = await prisma.customer.update({
      where: { id: userId },
      data: {
        fullName: data.full_name,
        phone: data.phone,
        avatarUrl: data.avatar_url,
      },
    });
    logger.info({ userId }, "Profile updated successfully");
    return profile;
  } catch (error: any) {
    logger.error({ error, userId }, "Error updating profile");
    throw new ErrorUnknown(); // Re-throw other errors
  }
}
