"use client";

import { UI_LABELS } from "@/lib/constants";
import { AddressType } from "@/prisma/generated/prisma/browser";
import { Building, Home, InfoIcon, LucideIcon, MapPin } from "lucide-react";

interface Address {
  id: string;
  type: AddressType;
  street: string;
  area?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressTypeInfoProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

interface AddressSectionProps {
  addresses: Address[];
  title: string;
  icon: LucideIcon;
  colorScheme: "emerald" | "blue" | "slate";
  showDefaultBadge?: boolean;
}

/**
 * Elegant masking overlay with slate gradient
 * Creates a professional frosted-glass effect with subtle gradient transitions
 */
function SlateMaskOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
      {/* Primary gradient mask layer */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-100/80 via-slate-50/60 to-white/40 pointer-events-none z-0" />
      {/* Subtle radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_top_right] from-slate-200/30 via-transparent to-slate-100/20 pointer-events-none z-0" />
      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Professional glass-morphism card effect with slate theme
 * Use for elevated content cards requiring visual hierarchy
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
        relative overflow-hidden rounded-lg sm:rounded-xl
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

function AddressTypeInfo({ title, description, icon: Icon = InfoIcon }: AddressTypeInfoProps) {
  return (
    <SlateGlassCard className="p-2.5 sm:p-3 px-3 sm:px-4 space-y-1">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-linear-to-br from-slate-100 to-slate-200/80">
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
        </div>
        <h3 className="font-semibold text-sm sm:text-base text-slate-800">{title}</h3>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{description}</p>
    </SlateGlassCard>
  );
}

function AddressSection({
  addresses,
  title,
  icon: Icon,
  colorScheme,
  showDefaultBadge = false,
}: AddressSectionProps) {
  const colorClasses = {
    emerald: {
      icon: "text-emerald-600",
      border: "border-emerald-200",
      background: "bg-linear-to-br from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
    },
    blue: {
      icon: "text-blue-600",
      border: "border-blue-200",
      background: "bg-linear-to-br from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
    },
    slate: {
      icon: "text-slate-600",
      border: "border-slate-200/60",
      background: "bg-linear-to-br from-white/90 via-slate-50/80 to-slate-100/70",
      borderColor: "border-slate-200/60",
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <div className="flex-1 min-w-60 sm:min-w-75">
      {/* Section header with elegant gradient underline */}
      <div
        className={`flex whitespace-nowrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 pb-2 border-b ${colors.border}`}
      >
        <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-linear-to-br from-slate-100 to-slate-200/80">
          <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colors.icon}`} />
        </div>
        <h3 className="font-bold text-sm sm:text-base text-slate-800">
          {title}
          {addresses.length > 1 ? "es" : ""}
        </h3>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded-full">
          {addresses.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`
              relative flex-1 p-3 sm:p-4 min-w-full sm:min-w-52 rounded-lg sm:rounded-xl overflow-hidden
              ${colors.background}
              border ${colors.borderColor}
              backdrop-blur-sm
              shadow-[0_2px_12px_-3px_rgba(51,65,85,0.08)]
              transition-all duration-300 ease-out
              before:absolute before:inset-0 
              before:bg-linear-to-tr before:from-slate-200/10 before:via-transparent before:to-white/20
              before:pointer-events-none
            `}
          >
            {/* Subtle top highlight for depth */}
            <div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />

            <div className="relative z-10">
              {showDefaultBadge && address.isDefault && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 mb-2 sm:mb-3 bg-linear-to-r from-slate-600 to-slate-700 text-white text-xs font-semibold rounded-full shadow-sm">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse" />
                  {UI_LABELS.PROFILE.DEFAULT}
                </span>
              )}
              <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-slate-700">
                <p className="font-semibold text-slate-800">{address.street}</p>
                {address.area && <p className="text-slate-500">{address.area}</p>}
                <p className="text-slate-600">
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p className="text-slate-500 text-xs uppercase tracking-wide">{address.country}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AddressInfoCardProps {
  addresses: Address[];
}

export function AddressInfoCard({ addresses }: AddressInfoCardProps) {
  const shippingAddresses = addresses.filter((addr) => addr.type === AddressType.SHIPPING);
  const billingAddresses = addresses.filter((addr) => addr.type === AddressType.BILLING);

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
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent rounded-lg sm:rounded-xl" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 tracking-tight">
              {UI_LABELS.PROFILE.ADDRESS_INFO}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {UI_LABELS.PROFILE.ADDRESS_INFO_SUBTITLE}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6">
        {addresses.length === 0 ? (
          <div className="text-center py-8 sm:py-10 md:py-12">
            <MapPin className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 text-slate-300" />
            <p className="text-slate-600 text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
              {UI_LABELS.PROFILE.NO_ADDRESSES_TITLE}
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              {UI_LABELS.PROFILE.NO_ADDRESSES_SUBTITLE}
            </p>
          </div>
        ) : (
          <div className="flex gap-4 sm:gap-6 md:gap-8 flex-wrap">
            {/* Shipping Addresses Section */}
            {shippingAddresses.length > 0 && (
              <AddressSection
                addresses={shippingAddresses}
                title={UI_LABELS.PROFILE.SHIPPING_ADDRESS}
                icon={Home}
                colorScheme="slate"
              />
            )}

            {/* Billing Addresses Section */}
            {billingAddresses.length > 0 && (
              <AddressSection
                addresses={billingAddresses}
                title={UI_LABELS.PROFILE.BILLING_ADDRESS}
                icon={Building}
                colorScheme="slate"
                showDefaultBadge={true}
              />
            )}
          </div>
        )}

        {/* Address Types Info - Always show */}
        <div className="mt-6 sm:mt-7 md:mt-8 pt-4 sm:pt-5 md:pt-6 border-t border-slate-200">
          <div className="space-y-3 sm:space-y-4">
            <AddressTypeInfo
              title={UI_LABELS.PROFILE.SHIPPING_ADDRESS}
              description={UI_LABELS.PROFILE.SHIPPING_ADDRESS_DESC}
            />

            <AddressTypeInfo
              title={UI_LABELS.PROFILE.BILLING_ADDRESS}
              description={UI_LABELS.PROFILE.BILLING_ADDRESS_DESC}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
