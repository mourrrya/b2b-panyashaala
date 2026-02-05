"use client";

import { ProfileApiProvider, useApiProfile } from "@/lib/client/providers/ProfileApiProvider";
import { UI_LABELS } from "@/lib/constants";
import { CustomerType } from "@/prisma/generated/prisma/browser";
import { useState } from "react";
import { AddressInfoCard } from "./components/AddressInfoCard";
import { BusinessInfoCard } from "./components/BusinessInfoCard";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { ProfileHeader } from "./components/ProfileHeader";

function ProfileContent() {
  const { profile, isLoading, updateProfile } = useApiProfile();
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const handleAvatarUpload = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const avatarUrl = e.target?.result as string;
          const result = await updateProfile({ avatarUrl });
          if (result.success) {
            console.log(UI_LABELS.PROFILE.UPDATE_SUCCESS);
            resolve();
          } else {
            reject(new Error(UI_LABELS.PROFILE.UPDATE_FAILED));
          }
        };
        reader.onerror = () => {
          reject(new Error(UI_LABELS.PROFILE.FILE_READ_FAILED));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{UI_LABELS.PROFILE.LOADING}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Profile Header with Member Since */}
      <ProfileHeader user={profile} onAvatarUpload={handleAvatarUpload} />

      {/* Profile Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid gap-4 sm:gap-6 md:gap-8">
          {/* Personal Information */}
          <PersonalInfoCard
            fullName={profile.fullName}
            email={profile.email}
            phone={profile.phone}
            accountType={profile.type}
          />

          {/* Business Information - Only for business accounts */}
          {profile.type === CustomerType.BUSINESS && (
            <BusinessInfoCard
              companyName={profile.companyName}
              gstIn={profile.gstIn}
              website={profile.website}
            />
          )}

          {/* Address Information */}
          <AddressInfoCard addresses={profile.addresses || []} />
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProfileApiProvider>
      <ProfileContent />
    </ProfileApiProvider>
  );
}
