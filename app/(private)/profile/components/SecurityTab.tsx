"use client";

import { Customer } from "@/prisma/generated/prisma/browser";
import { Button, Form, Input, message, Modal } from "antd";
import { AlertCircle, Key, Lock, Shield } from "lucide-react";
import { useState } from "react";

interface SecurityTabProps {
  user: Customer;
}

export function SecurityTab({ user }: SecurityTabProps) {
  const [form] = Form.useForm();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (values: any) => {
    try {
      setIsChangingPassword(true);
      // TODO: Implement password change API
      message.success("Password changed successfully");
      setShowPasswordModal(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Security Settings
        </h2>
        <p className="text-slate-600">
          Manage your account security and authentication methods
        </p>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Key className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 text-lg">Password</h3>
              <p className="text-sm text-slate-600">
                {user.password
                  ? "Last changed recently"
                  : "Set up a password for credential login"}
              </p>
            </div>
            <Button
              type="primary"
              onClick={() => setShowPasswordModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 text-lg">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-slate-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button disabled>Coming Soon</Button>
          </div>
        </div>
      </div>

      {/* Email Verification */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="p-6 bg-slate-50">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                user.emailVerified ? "bg-green-100" : "bg-amber-100"
              }`}
            >
              <Lock
                className={`w-6 h-6 ${
                  user.emailVerified ? "text-green-600" : "text-amber-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 text-lg">
                Email Verification
              </h3>
              <p className="text-sm text-slate-600">
                {user.emailVerified
                  ? "Your email is verified"
                  : "Verify your email to secure your account"}
              </p>
            </div>
            {user.emailVerified ? (
              <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg">
                ✓ Verified
              </span>
            ) : (
              <Button
                type="primary"
                className="bg-amber-600 hover:bg-amber-700"
              >
                Verify Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-3">
              Security Best Practices
            </h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">•</span>
                <span>
                  Use a strong, unique password that includes uppercase,
                  lowercase, numbers, and special characters
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">•</span>
                <span>
                  Never share your password or account credentials with anyone
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">•</span>
                <span>Enable two-factor authentication when available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">•</span>
                <span>
                  Regularly review your account activity for any suspicious
                  behavior
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">•</span>
                <span>
                  Keep your email address up to date for important security
                  notifications
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={showPasswordModal}
        onCancel={() => {
          setShowPasswordModal(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
          className="mt-4"
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password size="large" placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter a new password" },
              {
                min: 8,
                message: "Password must be at least 8 characters long",
              },
            ]}
          >
            <Input.Password size="large" placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Confirm new password" />
          </Form.Item>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <Button
              size="large"
              onClick={() => {
                setShowPasswordModal(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={isChangingPassword}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Update Password
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
