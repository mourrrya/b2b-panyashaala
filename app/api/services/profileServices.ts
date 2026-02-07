import { AuthUser } from "@/lib/auth/protect";
import { ErrorUnknown } from "@/lib/backend/errorHandler";
import { prisma } from "@/lib/backend/prisma";
import { Address, Customer } from "@/prisma/generated/prisma/client";

export async function getOrCreateProfile(
  userId: string,
  userData: AuthUser,
): Promise<Customer & { _count?: { orders: number }; addresses: Address[] }> {
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
    return profile;
  } catch (error: any) {
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
    return profile;
  } catch (error: any) {
    throw new ErrorUnknown(); // Re-throw other errors
  }
}
