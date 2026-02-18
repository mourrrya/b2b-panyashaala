"use client";

import { ProfileSkeletonLoader } from "@/components/SkeletonLoader";
import { ProfileApiProvider, useApiProfile } from "@/lib/client/providers/ProfileApiProvider";
import { UI_LABELS } from "@/lib/constants";
import { CustomerType } from "@/prisma/generated/prisma/browser";
import { toast } from "sonner";
import { AddressInfoCard } from "./components/AddressInfoCard";
import { BusinessInfoCard } from "./components/BusinessInfoCard";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { ProfileHeader } from "./components/ProfileHeader";

function ProfileContent() {
  const { profile, isLoading, uploadAvatar } = useApiProfile();

  const handleAvatarUpload = async (file: File) => {
    const result = await uploadAvatar(file);
    if (!result.success) {
      toast.error(UI_LABELS.PROFILE.UPDATE_FAILED);
    }
  };

  if (isLoading || !profile) {
    return <ProfileSkeletonLoader />;
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
