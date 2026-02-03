"use client";

import { CustomerType } from "@/prisma/generated/prisma/browser";
import { useAuthStore } from "@/store/auth-store";
import { Button as AntButton, message, Tabs, Upload } from "antd";
import {
  Briefcase,
  Building2,
  Camera,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AddressTab,
  BusinessInfoTab,
  PersonalInfoTab,
  SecurityTab,
} from "./components";

export default function ProfilePage() {
  const { user, fetchProfile, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState("personal");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploadingAvatar(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const avatarUrl = e.target?.result as string;
        const result = await updateProfile({ avatarUrl });
        if (result.success) {
          message.success("Profile picture updated successfully");
        } else {
          message.error(result.error || "Failed to update profile picture");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      message.error("Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      key: "personal",
      label: (
        <span className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Personal Info</span>
        </span>
      ),
      children: <PersonalInfoTab user={user} />,
    },
    ...(user.type === CustomerType.BUSINESS
      ? [
          {
            key: "business",
            label: (
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Business Info</span>
              </span>
            ),
            children: <BusinessInfoTab user={user} />,
          },
        ]
      : []),
    {
      key: "addresses",
      label: (
        <span className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">Addresses</span>
        </span>
      ),
      children: <AddressTab user={user} />,
    },
    {
      key: "security",
      label: (
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Security</span>
        </span>
      ),
      children: <SecurityTab user={user} />,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-texture opacity-30"></div>
        <div className="max-w-6xl mx-auto px-6 py-12 relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
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
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleAvatarUpload(file);
                  return false;
                }}
                disabled={uploadingAvatar}
              >
                <AntButton
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white text-emerald-600 border-none shadow-lg hover:bg-emerald-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  icon={<Camera className="w-4 h-4" />}
                  loading={uploadingAvatar}
                  title="Change profile picture"
                />
              </Upload>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {user.fullName || user.companyName || "Welcome"}
              </h1>
              <div className="flex flex-col md:flex-row gap-4 text-emerald-100">
                {user.email && (
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                {user.type === CustomerType.BUSINESS && (
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">Business Account</span>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:flex gap-6">
              <div className="text-center px-6 py-4 bg-white/10 backdrop-blur rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-emerald-100">Orders</div>
              </div>
              <div className="text-center px-6 py-4 bg-white/10 backdrop-blur rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-emerald-100">Enquiries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabs}
            className="profile-tabs"
            size="large"
          />
        </div>
      </div>
      <style jsx global>{`
        .profile-tabs .ant-tabs-nav {
          padding: 0 24px;
          background: linear-gradient(to bottom, #f8fafc, #ffffff);
          border-bottom: 2px solid #f1f5f9;
        }
        .profile-tabs .ant-tabs-tab {
          padding: 16px 24px;
          color: #64748b;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .profile-tabs .ant-tabs-tab:hover {
          color: #115e59;
        }
        .profile-tabs .ant-tabs-tab-active {
          color: #115e59;
        }
        .profile-tabs .ant-tabs-ink-bar {
          background: linear-gradient(to right, #10b981, #14b8a6);
          height: 3px;
          border-radius: 3px 3px 0 0;
        }
        .profile-tabs .ant-tabs-content {
          padding: 32px 24px;
        }
        @media (max-width: 640px) {
          .profile-tabs .ant-tabs-nav {
            padding: 0 12px;
          }
          .profile-tabs .ant-tabs-tab {
            padding: 12px 16px;
            font-size: 14px;
          }
          .profile-tabs .ant-tabs-content {
            padding: 24px 16px;
          }
        }
      `}</style>
    </div>
  );
}
