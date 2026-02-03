"use client";

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
  colorScheme: "emerald" | "blue" | "grey";
  showDefaultBadge?: boolean;
}

function AddressTypeInfo({
  title,
  description,
  icon: Icon = InfoIcon,
}: AddressTypeInfoProps) {
  return (
    <div className="p-2 px-4 space-y-1 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-slate-600" />
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="text-sm text-slate-800">{description}</p>
    </div>
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
    grey: {
      icon: "text-slate-600",
      border: "border-slate-200",
      background: "bg-linear-to-br from-slate-50 to-slate-100",
      borderColor: "border-slate-200",
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <div className="flex-1 min-w-75">
      <div
        className={`flex whitespace-nowrap items-center gap-2 mb-4 py-2 border-b ${colors.border}`}
      >
        <Icon className={`w-5 h-5 ${colors.icon}`} />
        <h3 className="font-bold text-slate-800">
          {title}
          {addresses.length > 1 ? "es" : ""}
        </h3>
        <span className="text-sm text-slate-500">({addresses.length})</span>
      </div>

      <div className="flex flex-wrap gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`flex-1 p-4 ${colors.background} rounded-lg border ${colors.borderColor} min-w-52`}
          >
            {showDefaultBadge && address.isDefault && (
              <span className="inline-block px-2 py-1 mb-2 bg-blue-600 text-white text-xs font-semibold rounded-full">
                Default
              </span>
            )}
            <div className="space-y-1 text-sm text-slate-700">
              <p className="font-medium">{address.street}</p>
              {address.area && <p className="text-slate-600">{address.area}</p>}
              <p>
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="text-slate-600">{address.country}</p>
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
  const shippingAddresses = addresses.filter(
    (addr) => addr.type === AddressType.SHIPPING,
  );
  const billingAddresses = addresses.filter(
    (addr) => addr.type === AddressType.BILLING,
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-r from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Saved Addresses
            </h2>
            <p className="text-sm text-slate-600">
              Your shipping and billing addresses
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-600 text-lg font-semibold mb-2">
              No addresses saved yet
            </p>
            <p className="text-sm text-slate-500">
              You haven't added any addresses to your profile
            </p>
          </div>
        ) : (
          <div className="flex gap-8 flex-wrap">
            {/* Shipping Addresses Section */}
            {shippingAddresses.length > 0 && (
              <AddressSection
                addresses={shippingAddresses}
                title="Shipping Address"
                icon={Home}
                colorScheme="grey"
              />
            )}

            {/* Billing Addresses Section */}
            {billingAddresses.length > 0 && (
              <AddressSection
                addresses={billingAddresses}
                title="Billing Address"
                icon={Building}
                colorScheme="grey"
                showDefaultBadge={true}
              />
            )}
          </div>
        )}

        {/* Address Types Info - Always show */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="space-y-4">
            <AddressTypeInfo
              title="Shipping Address"
              description="The address where your orders will be delivered. You can add multiple shipping addresses for convenience."
            />

            <AddressTypeInfo
              title="Billing Address"
              description="The address that appears on invoices and payment records. This is often your business registered address."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
