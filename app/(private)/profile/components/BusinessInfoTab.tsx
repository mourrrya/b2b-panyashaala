"use client";

import { Customer } from "@/prisma/generated/prisma/browser";
import { useAuthStore } from "@/store/auth-store";
import { Button, Form, Input, message } from "antd";
import { Briefcase, Building2, FileText, Globe, Save } from "lucide-react";
import { useState } from "react";

interface BusinessInfoTabProps {
  user: Customer;
}

export function BusinessInfoTab({ user }: BusinessInfoTabProps) {
  const { updateProfile, isLoading } = useAuthStore();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (values: any) => {
    try {
      const result = await updateProfile({
        companyName: values.companyName,
        taxId: values.taxId,
        gstIn: values.gstIn,
        website: values.website,
        notes: values.notes,
      });

      if (result.success) {
        message.success("Business information updated successfully");
        setIsEditing(false);
      } else {
        message.error(result.error || "Failed to update business information");
      }
    } catch (error) {
      message.error("An error occurred while updating business information");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Business Information
          </h2>
          <p className="text-slate-600">
            Manage your business details and tax information
          </p>
        </div>
        {!isEditing && (
          <Button
            type="primary"
            onClick={() => setIsEditing(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Edit
          </Button>
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          companyName: user.companyName || "",
          taxId: user.taxId || "",
          gstIn: user.gstIn || "",
          website: user.website || "",
          notes: user.notes || "",
        }}
        onFinish={handleSave}
        disabled={!isEditing}
      >
        <div className="space-y-6">
          {/* Company Name */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <Form.Item
              label={
                <span className="flex items-center gap-2 font-semibold text-slate-700">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Company Name
                </span>
              }
              name="companyName"
              rules={[
                { required: true, message: "Please enter your company name" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter company name"
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          {/* Tax ID & GSTIN */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <Form.Item
                label={
                  <span className="flex items-center gap-2 font-semibold text-slate-700">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Tax ID
                  </span>
                }
                name="taxId"
              >
                <Input
                  size="large"
                  placeholder="Enter tax ID"
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <Form.Item
                label={
                  <span className="flex items-center gap-2 font-semibold text-slate-700">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    GSTIN
                  </span>
                }
                name="gstIn"
                rules={[
                  {
                    pattern:
                      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                    message: "Please enter a valid GSTIN",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter GSTIN"
                  className="rounded-lg"
                />
              </Form.Item>
            </div>
          </div>

          {/* Website */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <Form.Item
              label={
                <span className="flex items-center gap-2 font-semibold text-slate-700">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  Website
                </span>
              }
              name="website"
              rules={[
                {
                  type: "url",
                  message: "Please enter a valid URL",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="https://www.example.com"
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          {/* Business Notes */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <Form.Item
              label={
                <span className="flex items-center gap-2 font-semibold text-slate-700">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  Business Notes
                </span>
              }
              name="notes"
            >
              <Input.TextArea
                rows={4}
                placeholder="Add any additional business information..."
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 justify-end pt-4 border-t border-slate-200">
              <Button
                size="large"
                onClick={() => {
                  form.resetFields();
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={isLoading}
                icon={<Save className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </Form>

      {/* Business Type Info */}
      <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
        <h3 className="font-semibold text-amber-900 mb-3">
          Business Account Benefits
        </h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">✓</span>
            <span>Access to bulk pricing and wholesale rates</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">✓</span>
            <span>Dedicated account manager support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">✓</span>
            <span>Priority order processing and shipment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">✓</span>
            <span>Flexible payment terms and credit options</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
