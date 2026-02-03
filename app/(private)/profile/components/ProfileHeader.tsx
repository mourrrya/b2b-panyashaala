"use client";

import { CustomerType } from "@/prisma/generated/prisma/browser";
import { Camera, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const router = useRouter();

  // Fetch order count on mount
  useEffect(() => {
    async function fetchOrderCount() {
      try {
        const response = await fetch("/api/orders");
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            setOrderCount(data.data.length);
          }
        }
      } catch (error) {
        console.error("Failed to fetch order count:", error);
      }
    }
    fetchOrderCount();
  }, []);

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
    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/60 border-l-emerald-200/40">
      {/* Subtle background pattern for depth */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_top_left] from-slate-50/50 via-transparent to-transparent pointer-events-none" />

      {/* Header with elegant gradient mask */}
      <div className="relative bg-linear-to-r from-slate-50 via-slate-100/80 to-slate-50 px-2 md:px-6 py-8 border-b border-slate-200/60">
        {/* Top edge highlight */}
        <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-white to-transparent" />

        <div className="flex gap-6 flex-wrap items-center justify-start max-w-6xl mx-auto  px-3 md:px-6">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 shadow-xl bg-white">
              <Image
                src={user.avatarUrl || "/placeholder-user.jpg"}
                alt={user.fullName || user.companyName || "Profile"}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white text-slate-600 border border-slate-200 shadow-lg hover:bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
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
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-600 border-t-transparent"></div>
                </div>
              )}
            </label>
          </div>

          <div className="flex flex-1 items-center justify-between gap-4 md:gap-8">
            {/* User Info Section */}
            <div className="flex-1">
              <div className="w-fit sm:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 whitespace-nowrap text-slate-800">
                  {user.fullName || user.companyName || "Welcome"}
                </h1>

                {/* Member Since */}
                {getMemberSinceText() && (
                  <div className="inline-block bg-linear-to-r from-slate-100 to-slate-200/80 backdrop-blur-sm rounded-lg px-4 py-2 whitespace-nowrap border border-slate-200/60">
                    <p className="text-sm font-medium text-slate-600">
                      {getMemberSinceText()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Orders Stats Card */}
            <div
              className="relative overflow-hidden rounded-xl bg-linear-to-br from-white/90 via-slate-50/80 to-slate-100/70 backdrop-blur-sm border border-slate-200/60 shadow-[0_2px_12px_-3px_rgba(51,65,85,0.08)] px-6 py-4 before:absolute before:inset-0 before:bg-linear-to-tr before:from-emerald-50/20 before:via-transparent before:to-white/30 before:pointer-events-none transition-all duration-300 ease-out hover:shadow-[0_8px_24px_-6px_rgba(51,65,85,0.15)] hover:-translate-y-0.5 cursor-pointer group"
              onClick={() => router.push("/order")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push("/order");
                }
              }}
            >
              {/* Top edge highlight */}
              <div className="absolute top-0 left-3 right-3 h-px bg-linear-to-r from-transparent via-white/60 to-transparent z-10" />

              <div className="relative z-10 flex items-center gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">
                    {orderCount !== null ? (
                      orderCount
                    ) : (
                      <span className="inline-block w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                    )}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                    Orders
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
