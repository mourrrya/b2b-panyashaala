import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export const sendOtp = async (
  phone: string,
): Promise<{ success: boolean; error?: string }> => {
  console.log("🔐 [AUTH] sendOtp called with phone:", phone);

  try {
    console.log("📱 [AUTH] Calling supabase.auth.signInWithOtp...");
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
    });

    console.log("📊 [AUTH] Supabase response:", { data: !!data, error });

    if (error) {
      console.error("❌ [AUTH] OTP send failed:", error);
      console.error("❌ [AUTH] Error details:", {
        message: error.message,
        status: error.status,
        name: error.name,
      });
      return { success: false, error: error.message };
    }

    console.log("✅ [AUTH] OTP sent successfully");
    return { success: true };
  } catch (error) {
    console.error("💥 [AUTH] Unexpected error in sendOtp:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const verifyOtp = async (
  phone: string,
  token: string,
): Promise<{ success: boolean; user?: User; error?: string }> => {
  console.log(
    "🔐 [AUTH] verifyOtp called with phone:",
    phone,
    "token length:",
    token.length,
  );

  try {
    console.log("📱 [AUTH] Calling supabase.auth.verifyOtp...");
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    console.log("📊 [AUTH] Supabase verify response:", {
      hasData: !!data,
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      error: error ? error.message : null,
    });

    if (error) {
      console.error("❌ [AUTH] OTP verification failed:", error);
      console.error("❌ [AUTH] Error details:", {
        message: error.message,
        status: error.status,
        name: error.name,
      });
      return { success: false, error: error.message };
    }

    if (data.user) {
      console.log("✅ [AUTH] OTP verified successfully, user:", data.user.id);
      return { success: true, user: data.user };
    } else {
      console.warn("⚠️ [AUTH] Verification succeeded but no user returned");
      return { success: false, error: "Verification failed" };
    }
  } catch (error) {
    console.error("💥 [AUTH] Unexpected error in verifyOtp:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const logout = async (): Promise<void> => {
  console.log("🚪 [AUTH] logout called");
  try {
    await supabase.auth.signOut();
    console.log("✅ [AUTH] logout successful");
  } catch (error) {
    console.error("💥 [AUTH] Logout error:", error);
  }
};

export const initializeAuth = async (): Promise<{ user: User | null }> => {
  console.log("🔄 [AUTH] initializeAuth called");
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    console.log("📊 [AUTH] Session check result:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      error: error ? error.message : null,
    });

    if (error) {
      console.error("❌ [AUTH] Session error:", error);
      return { user: null };
    }

    if (session?.user) {
      console.log("✅ [AUTH] Existing session found, user:", session.user.id);
      return { user: session.user };
    } else {
      console.log("ℹ️ [AUTH] No existing session");
      return { user: null };
    }
  } catch (error) {
    console.error("💥 [AUTH] Initialize error:", error);
    return { user: null };
  }
};
