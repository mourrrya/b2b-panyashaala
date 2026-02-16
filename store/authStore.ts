"use client";

import { ERROR_MESSAGES } from "@/lib/constants";
import { captureException } from "@/lib/sentry";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// =============================================================================
// TYPES
// =============================================================================

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

interface AuthState {
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  // Core auth actions
  signInWithCredentials: (params: SignInCredentialsParams) => Promise<AuthResult>;
  signInWithGoogle: (callbackUrl?: string) => Promise<void>;
  signOut: () => Promise<void>;

  // State management
  initialize: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

// =============================================================================
// STORE
// =============================================================================

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        isLoading: false,
        isInitialized: false,

        // Actions
        signInWithCredentials: async ({
          email,
          password,
          isSignUp = false,
          name,
        }: SignInCredentialsParams) => {
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

            set({ isLoading: false });
            return { success: true };
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : ERROR_MESSAGES.UNEXPECTED;
            captureException(error, {
              tags: { layer: "auth", action: "signInWithCredentials" },
              extra: { isSignUp },
            });
            set({ isLoading: false });
            return {
              success: false,
              error: message,
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
            set({ isLoading: false });
          } catch (error) {
            captureException(error, {
              tags: { layer: "auth", action: "signOut" },
            });
            set({ isLoading: false });
          }
        },

        initialize: async () => {
          if (get().isInitialized) return;

          set({ isLoading: true });

          try {
            const { getSession } = await import("next-auth/react");
            await getSession();
          } catch (error) {
            captureException(error, {
              tags: { layer: "auth", action: "initialize" },
            });
          } finally {
            set({ isLoading: false, isInitialized: true });
          }
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
      }),
      {
        name: "auth-store",
        // Only persist initialization flag, not loading state
        partialize: (state) => ({
          isInitialized: state.isInitialized,
        }),
      },
    ),
    { name: "auth-store" },
  ),
);

// =============================================================================
// SELECTOR HOOKS - Granular subscriptions (follow STORE_ARCHITECTURE pattern)
// =============================================================================

export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthInitialized = () => useAuthStore((state) => state.isInitialized);
export const useSignInWithCredentials = () => useAuthStore((state) => state.signInWithCredentials);
export const useSignInWithGoogle = () => useAuthStore((state) => state.signInWithGoogle);
export const useSignOut = () => useAuthStore((state) => state.signOut);
export const useInitializeAuth = () => useAuthStore((state) => state.initialize);
