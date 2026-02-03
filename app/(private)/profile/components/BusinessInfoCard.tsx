"use client";

import { Building2, FileText, Globe } from "lucide-react";

interface BusinessInfoCardProps {
  companyName?: string | null;
  gstIn?: string | null;
  website?: string | null;
}

export function BusinessInfoCard({
  companyName,
  gstIn,
  website,
}: BusinessInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Business Information
            </h2>
            <p className="text-sm text-slate-600">
              Your business details and tax information
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {/* Company Name */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Company Name
              </label>
              <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-lg p-3">
                <span className="text-slate-800">
                  {companyName || "Not provided"}
                </span>
              </div>
            </div>

            {/* GST IN */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                GST IN
              </label>
              <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-lg p-3">
                <span className="text-slate-800">
                  {gstIn || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Website */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Globe className="w-4 h-4 text-blue-600" />
                Website
              </label>
              <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-lg p-3">
                {website ? (
                  <a
                    href={
                      website.startsWith("http")
                        ? website
                        : `https://${website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {website}
                  </a>
                ) : (
                  <span className="text-slate-800">Not provided</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
