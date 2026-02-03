"use client";

import { Mail, Phone, User } from "lucide-react";

interface PersonalInfoCardProps {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  accountType?: string | null;
}

export function PersonalInfoCard({
  fullName,
  email,
  phone,
  accountType,
}: PersonalInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Personal Information
            </h2>
            <p className="text-sm text-slate-600">
              Your personal details and contact information
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {/* Full Name */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <User className="w-4 h-4 text-emerald-600" />
                Full Name
              </label>
              <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-lg p-3">
                <span className="text-slate-800">
                  {fullName || "Not provided"}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                Email Address
              </label>
              <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-lg p-3">
                <span className="text-slate-800">
                  {email || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Phone */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                Phone Number
              </label>
              <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-lg p-3">
                <span className="text-slate-800">
                  {phone || "Not provided"}
                </span>
              </div>
            </div>

            {/* Account Type */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <User className="w-4 h-4 text-emerald-600" />
                Account Type
              </label>
              <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-lg p-3">
                <span className="text-slate-800 capitalize">
                  {accountType?.toLowerCase() || "Individual"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
