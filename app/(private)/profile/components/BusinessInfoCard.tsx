"use client";

import { UI_LABELS } from "@/lib/constants";
import { Building2, FileText, Globe } from "lucide-react";

interface BusinessInfoCardProps {
  companyName?: string | null;
  gstIn?: string | null;
  website?: string | null;
}

/**
 * Slate Glass Card - Professional glass-morphism effect with slate theme
 */
function SlateGlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl
        bg-linear-to-br from-white/90 via-slate-50/80 to-slate-100/70
        backdrop-blur-sm
        border border-slate-200/60
        shadow-[0_4px_24px_-4px_rgba(51,65,85,0.12)]
        before:absolute before:inset-0
        before:bg-linear-to-tr before:from-slate-200/20 before:via-transparent before:to-white/30
        before:pointer-events-none
        ${className}
      `}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Business Info Field - Individual field with elegant slate styling
 */
function BusinessInfoField({
  label,
  value,
  icon: Icon,
  isLink = false,
}: {
  label: string;
  value: string | null | undefined;
  icon: React.ComponentType<{ className?: string }>;
  isLink?: boolean;
}) {
  return (
    <div className="group">
      <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
        <div className="p-0.5 sm:p-1 rounded-md sm:rounded-lg bg-linear-to-br from-slate-100 to-slate-200/80">
          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" />
        </div>
        {label}
      </label>
      <SlateGlassCard className="p-2.5 sm:p-3 transition-all duration-300 ease-out">
        {isLink && value ? (
          <a
            href={value.startsWith("http") ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base text-slate-700 underline decoration-slate-300"
          >
            {value}
          </a>
        ) : (
          <span className="text-sm sm:text-base text-slate-800">
            {value || UI_LABELS.PROFILE.NOT_PROVIDED}
          </span>
        )}
      </SlateGlassCard>
    </div>
  );
}

export function BusinessInfoCard({
  companyName,
  gstIn,
  website,
}: BusinessInfoCardProps) {
  return (
    <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-slate-200/60">
      {/* Subtle background pattern for depth */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_top_left] from-slate-50/50 via-transparent to-transparent pointer-events-none" />

      {/* Header with elegant gradient mask */}
      <div className="relative bg-linear-to-r from-slate-50 via-slate-100/80 to-slate-50 px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-slate-200/60">
        {/* Top edge highlight */}
        <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-white to-transparent" />

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            {/* Icon container with layered gradient */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-slate-500 via-slate-600 to-slate-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/25">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent rounded-lg sm:rounded-xl" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 tracking-tight">
              {UI_LABELS.PROFILE.BUSINESS_INFO}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {UI_LABELS.PROFILE.BUSINESS_INFO_SUBTITLE}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6">
        <div className="grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-2">
          <div className="space-y-3 sm:space-y-4">
            {/* Company Name */}
            <BusinessInfoField
              label={UI_LABELS.PROFILE.COMPANY_NAME}
              value={companyName}
              icon={Building2}
            />

            {/* GST IN */}
            <BusinessInfoField
              label={UI_LABELS.PROFILE.GST_IN}
              value={gstIn}
              icon={FileText}
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* Website */}
            <BusinessInfoField
              label={UI_LABELS.PROFILE.WEBSITE}
              value={website}
              icon={Globe}
              isLink={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
