"use client";

import { apiClient } from "@/lib/client/api/axios";
import { ERROR_MESSAGES } from "@/lib/constants";
import { PRIVATE_ROUTES } from "@/lib/constants/routes";
import { Address, Customer } from "@/prisma/generated/prisma/browser";
import { SuccessRes } from "@/types/api.payload.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Types for auth actions
interface SignInCredentialsParams {
  email: string;
  password: string;
  isSignUp?: boolean;
  name?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

type UserData = Customer & {
  _count?: { orders: number };
  addresses: Address[];
};

interface AuthState {
  user: UserData | null;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  // Core auth actions
  signInWithCredentials: (params: SignInCredentialsParams) => Promise<AuthResult>;
  signInWithGoogle: (callbackUrl?: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Profile management
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Customer>) => Promise<AuthResult>;

  // State management
  initialize: () => Promise<void>;
  setUser: (user: UserData | null) => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    immer((set, get) => ({
      user: null,
      isLoading: false,
      isInitialized: false,

      signInWithCredentials: async ({ email, password, isSignUp = false, name }) => {
        set({ isLoading: true });
        try {
          const { signIn } = await import("next-auth/react");

          const result = await signIn("credentials", {
            email,
            password,
            name: name || "",
            isSignUp: isSignUp ? "true" : "false",
            redirect: false,
          });

          if (result?.error) {
            set({ isLoading: false });
            return { success: false, error: result.error };
          }

          // Fetch profile after successful sign in
          await get().fetchProfile();
          set({ isLoading: false });
          return { success: true };
        } catch (error: any) {
          set({ isLoading: false });
          return {
            success: false,
            error: error?.message || ERROR_MESSAGES.UNEXPECTED,
          };
        }
      },

      signInWithGoogle: async (callbackUrl = "/") => {
        const { signIn } = await import("next-auth/react");
        await signIn("google", { callbackUrl });
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          const { signOut: authSignOut } = await import("next-auth/react");
          await authSignOut({ redirect: false });
          set({ user: null, isLoading: false });
        } catch (error) {
          console.error("Sign out error:", error);
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        try {
          const response = await apiClient.get<SuccessRes<UserData>>(PRIVATE_ROUTES.PROFILE);
          if (response.success && response.data) {
            set({ user: response.data });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      },

      updateProfile: async (data) => {
        try {
          const response = await apiClient.put<SuccessRes<UserData>>(PRIVATE_ROUTES.PROFILE, data);

          if (response.success && response.data) {
            set({ user: response.data });
            return { success: true };
          }

          return {
            success: false,
            error: ERROR_MESSAGES.PROFILE.UPDATE_FAILED,
          };
        } catch (error: any) {
          return {
            success: false,
            error: error?.message || ERROR_MESSAGES.PROFILE.UPDATE_FAILED,
          };
        }
      },

      initialize: async () => {
        if (get().isInitialized) return;

        set({ isLoading: true });
        try {
          const { getSession } = await import("next-auth/react");
          const session = await getSession();

          if (session?.user) {
            await get().fetchProfile();
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
        } finally {
          set({ isLoading: false, isInitialized: true });
        }
      },

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
    })),
    { name: "auth-store" },
  ),
);

// Selector hooks for common use cases
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
