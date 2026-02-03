"use client";

import { CustomerType } from "@/prisma/generated/prisma/browser";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileHeaderProps {
  user: {
    avatarUrl?: string | null;
    fullName?: string | null;
    companyName?: string | null;
    email?: string | null;
    phone?: string | null;
    type?: CustomerType;
    createdAt?: Date;
  };
  onAvatarUpload: (file: File) => Promise<void>;
}

export function ProfileHeader({ user, onAvatarUpload }: ProfileHeaderProps) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const ALLOWED_FILE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];
  const MAX_FILE_SIZE = 200 * 1024; // 200KB in bytes

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Invalid file type. Allowed types: PNG, JPG, JPEG, WebP";
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 200KB limit. Your file is ${(file.size / 1024).toFixed(2)}KB`;
    }

    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);

      if (error) {
        toast.error(error);
        return;
      }

      try {
        setUploadingAvatar(true);
        await onAvatarUpload(file);
        toast.success("Profile picture updated successfully!");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to upload avatar",
        );
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const getMemberSinceText = () => {
    if (!user.createdAt) return null;
    const year = new Date(user.createdAt).getFullYear();
    const month = new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "short",
    });
    return `Member Since ${month} ${year}`;
  };

  return (
    <div className="bg-linear-to-r from-emerald-600 to-teal-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-texture opacity-30"></div>
      <div className="max-w-6xl mx-auto  px-3 md:px-6 py-12  relative">
        <div className="flex gap-4 flex-wrap items-center justify-start">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white">
              <Image
                src={user.avatarUrl || "/placeholder-user.jpg"}
                alt={user.fullName || user.companyName || "Profile"}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white text-emerald-600 border-none shadow-lg hover:bg-emerald-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                disabled={uploadingAvatar}
                className="hidden"
              />
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent"></div>
                </div>
              )}
            </label>
          </div>
          <div className="flex flex-1 items-center justify-between  gap-4 md:gap-8">
            {/* User Info Section */}
            <div className="flex-1">
              <div className="w-fit sm:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 whitespace-nowrap">
                  {user.fullName || user.companyName || "Welcome"}
                </h1>

                {/* Member Since */}
                {getMemberSinceText() && (
                  <div className="inline-block bg-white/10 backdrop-blur rounded-lg px-4 py-2 whitespace-nowrap">
                    <p className="text-sm font-medium text-emerald-50">
                      {getMemberSinceText()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center px-6 py-4 bg-white/10 backdrop-blur rounded-lg">
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-emerald-100">Orders</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
