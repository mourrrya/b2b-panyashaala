"use client";

import { Customer } from "@/prisma/generated/prisma/browser";
import { Button, Empty, Modal } from "antd";
import { Building, Home, MapPin, Plus } from "lucide-react";
import { useState } from "react";

interface AddressTabProps {
  user: Customer;
}

export function AddressTab({ user }: AddressTabProps) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // TODO: Fetch addresses from API
  // useEffect(() => {
  //   fetchAddresses();
  // }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Saved Addresses
          </h2>
          <p className="text-slate-600">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-slate-50 rounded-xl p-12 text-center border border-slate-200">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-slate-600">
                <p className="text-lg font-semibold mb-2">
                  No addresses saved yet
                </p>
                <p className="text-sm">
                  Add your shipping and billing addresses to speed up checkout
                </p>
              </div>
            }
          >
            <Button
              type="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Add Your First Address
            </Button>
          </Empty>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address: any) => (
            <div
              key={address.id}
              className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-emerald-400 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {address.type === "SHIPPING" ? (
                    <Home className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Building className="w-5 h-5 text-blue-600" />
                  )}
                  <span className="font-semibold text-slate-800">
                    {address.type === "SHIPPING" ? "Shipping" : "Billing"}{" "}
                    Address
                  </span>
                </div>
                {address.isDefault && (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                    Default
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p>{address.street}</p>
                {address.area && <p>{address.area}</p>}
                <p>
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p>{address.country}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
                <Button size="small" className="flex-1">
                  Edit
                </Button>
                <Button size="small" danger>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Types Info */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-2 mb-3">
            <Home className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-emerald-900">Shipping Address</h3>
          </div>
          <p className="text-sm text-emerald-800">
            The address where your orders will be delivered. You can add
            multiple shipping addresses for convenience.
          </p>
        </div>

        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Billing Address</h3>
          </div>
          <p className="text-sm text-blue-800">
            The address that appears on invoices and payment records. This is
            often your business registered address.
          </p>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        title="Add New Address"
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        width={600}
      >
        <div className="text-center py-8 text-slate-600">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p>Address management functionality coming soon!</p>
          <p className="text-sm mt-2">
            You'll be able to add and manage multiple addresses here.
          </p>
        </div>
      </Modal>
    </div>
  );
}
