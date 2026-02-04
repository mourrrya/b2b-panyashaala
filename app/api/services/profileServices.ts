import { AuthUser } from "@/lib/auth/protect";
import { ErrorUnknown } from "@/lib/backend/errorHandler";
import { logger } from "@/lib/backend/logger";
import { prisma } from "@/lib/backend/prisma";
import { Address, Customer } from "@/prisma/generated/prisma/client";

export async function getOrCreateProfile(
  userId: string,
  userData: AuthUser,
): Promise<Customer & { _count?: { orders: number }; addresses: Address[] }> {
  logger.info({ userId }, "Getting or creating profile");
  try {
    let profile = await prisma.customer.findUnique({
      where: { id: userId },
      include: {
        addresses: {
          orderBy: { isDefault: "desc" }, // Default addresses first
        },
        _count: {
          select: { orders: true },
        },
      },
    });
    if (profile) return profile;
    profile = await prisma.customer.create({
      data: {
        id: userId,
        email: userData.email || null,
        fullName: userData.name || null,
      },
      include: {
        addresses: true,
        _count: {
          select: { orders: true },
        },
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
    gstIn?: string;
    website?: string;
    notes?: string;
  },
): Promise<Customer & { _count?: { orders: number } }> {
  logger.info({ userId }, "Updating profile");
  try {
    const profile = await prisma.customer.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
        companyName: data.companyName,
        gstIn: data.gstIn,
        website: data.website,
        notes: data.notes,
      },
      include: {
        addresses: {
          orderBy: { isDefault: "desc" },
        },
        _count: {
          select: { orders: true },
        },
      },
    });
    logger.info({ userId }, "Profile updated successfully");
    return profile;
  } catch (error: any) {
    logger.error({ error, userId }, "Error updating profile");
    throw new ErrorUnknown(); // Re-throw other errors
  }
}
