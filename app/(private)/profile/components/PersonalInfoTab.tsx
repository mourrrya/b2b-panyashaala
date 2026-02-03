"use client";

import { Customer } from "@/prisma/generated/prisma/browser";
import { useAuthStore } from "@/store/auth-store";
import { Button, Form, Input, message } from "antd";
import { Mail, Phone, Save, User } from "lucide-react";
import { useState } from "react";

interface PersonalInfoTabProps {
  user: Customer;
}

export function PersonalInfoTab({ user }: PersonalInfoTabProps) {
  const { updateProfile, isLoading } = useAuthStore();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (values: any) => {
    try {
      const result = await updateProfile({
        fullName: values.fullName,
        phone: values.phone,
      });

      if (result.success) {
        message.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        message.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      message.error("An error occurred while updating profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Personal Information
          </h2>
          <p className="text-slate-600">
            Manage your personal details and contact information
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
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
        }}
        onFinish={handleSave}
        disabled={!isEditing}
      >
        <div className="space-y-6">
          {/* Full Name */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <Form.Item
              label={
                <span className="flex items-center gap-2 font-semibold text-slate-700">
                  <User className="w-4 h-4 text-emerald-600" />
                  Full Name
                </span>
              }
              name="fullName"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your full name"
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          {/* Email */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <Form.Item
              label={
                <span className="flex items-center gap-2 font-semibold text-slate-700">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  Email Address
                </span>
              }
              name="email"
            >
              <Input
                size="large"
                type="email"
                disabled
                className="rounded-lg bg-slate-100"
                suffix={
                  <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
                    Cannot be changed
                  </span>
                }
              />
            </Form.Item>
            <p className="text-xs text-slate-500 mt-2">
              Your email address is used for login and cannot be changed.
            </p>
          </div>

          {/* Phone */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <Form.Item
              label={
                <span className="flex items-center gap-2 font-semibold text-slate-700">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Phone Number
                </span>
              }
              name="phone"
              rules={[
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your phone number"
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

      {/* Account Info */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">
          Account Information
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Account Type:</span>
            <span className="font-medium text-blue-900">
              {user.type === "BUSINESS"
                ? "Business Account"
                : "Individual Account"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Member Since:</span>
            <span className="font-medium text-blue-900">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {user.emailVerified && (
            <div className="flex justify-between">
              <span className="text-blue-700">Email Verified:</span>
              <span className="font-medium text-green-600">✓ Verified</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
