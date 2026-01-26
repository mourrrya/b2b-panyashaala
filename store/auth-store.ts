"use client";

import {
  initializeAuth,
  logout,
  sendOtp,
  verifyOtp,
} from "@/lib/client/apiCalling/auth";
import { fetchProfile } from "@/lib/client/apiCalling/profile";
import { Customer } from "@/prisma/generated/prisma/browser";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AuthState {
  user: Customer | null;
  otpSending: boolean;
  otpSent: boolean;
  phoneNumber: string;
}

interface AuthActions {
  onSendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  onVerifyOtp: (
    phone: string,
    token: string,
  ) => Promise<{ user?: User; success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  resetOtp: () => void;
  getProfile: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    immer((set, get) => ({
      user: null,
      otpSending: false,
      otpSent: false,
      phoneNumber: "",

      onSendOtp: async (phone: string) => {
        console.log("📤 [STORE] onSendOtp called with phone:", phone);
        set({ otpSending: true });
        const { success, error } = await sendOtp(phone);
        console.log("📤 [STORE] sendOtp result:", { success, error });
        if (!success) {
          set({ otpSending: false });
          return { success: false, error };
        }
        set({ otpSent: true, phoneNumber: phone, otpSending: false });
        console.log("✅ [STORE] OTP sent successfully, state updated");
        return { success: true };
      },

      onVerifyOtp: async (phone: string, token: string) => {
        console.log(
          "🔍 [STORE] onVerifyOtp called with phone:",
          phone,
          "token length:",
          token.length,
        );
        const { success, error } = await verifyOtp(phone, token);
        console.log("🔍 [STORE] verifyOtp result:", {
          success,
          error,
          hasUser: !!success,
        });
        if (!success) {
          set({ otpSending: false });
          return { success: false, error };
        }
        await get().getProfile();
        console.log("✅ [STORE] OTP verified and profile loaded");
        return { success: true };
      },

      getProfile: async () => {
        console.log("👤 [STORE] getProfile called");
        try {
          const response = await fetchProfile("/profile");
          console.log("👤 [STORE] fetchProfile response:", {
            success: response.success,
            hasData: !!response.data,
          });
          if (response.data) {
            set({ user: response.data });
            console.log(
              "✅ [STORE] Profile loaded successfully:",
              response.data.id,
            );
          } else {
            console.warn("⚠️ [STORE] No profile data returned");
          }
        } catch (error) {
          console.error("💥 [STORE] Error loading profile:", error);
        }
      },

      logout: async () => {
        console.log("🚪 [STORE] logout called");
        await logout();
        set({ user: null, otpSent: false, phoneNumber: "" });
        console.log("✅ [STORE] logout complete, state reset");
      },

      initialize: async () => {
        console.log("🔄 [STORE] initialize called");
        const { user } = await initializeAuth();
        console.log("🔄 [STORE] initialize result:", { hasUser: !!user });
        if (!user) {
          console.log("ℹ️ [STORE] No user session found");
          return;
        }
        await get().getProfile();
        console.log("✅ [STORE] Auth initialization complete");
      },

      resetOtp: () => {
        console.log("🔄 [STORE] resetOtp called");
        set({ otpSent: false, phoneNumber: "" });
        console.log("✅ [STORE] OTP state reset");
      },
    })),
    {
      name: "useAuthStore",
    },
  ),
);
