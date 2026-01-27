"use client";

import { useAuthStore } from "@/store/auth-store";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";

type AuthMode = "signin" | "signup";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const errorFromUrl = searchParams.get("error");

  const { signInWithCredentials, signInWithGoogle, isLoading } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(
    errorFromUrl ? decodeErrorMessage(errorFromUrl) : null,
  );

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error on input change
  };

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address";
    }
    if (!formData.password) {
      return "Password is required";
    }
    if (formData.password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (mode === "signup") {
      if (!formData.name.trim()) {
        return "Name is required";
      }
      if (formData.password !== formData.confirmPassword) {
        return "Passwords do not match";
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const result = await signInWithCredentials({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      isSignUp: mode === "signup",
      name: mode === "signup" ? formData.name.trim() : undefined,
    });

    if (!result.success) {
      setError(result.error || "Authentication failed");
      return;
    }

    router.push(redirectUrl);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    await signInWithGoogle(redirectUrl);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
    setError(null);
    setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-50 via-white to-teal-50" />

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-0 w-150 h-150 bg-linear-to-br from-emerald-400/20 via-teal-300/15 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-linear-to-tl from-amber-300/20 via-yellow-200/10 to-transparent rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 right-1/4 w-75 h-75 bg-linear-to-bl from-emerald-300/10 to-transparent rounded-full blur-2xl" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23115E59' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Branding & Info (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between p-12 relative">
          {/* Logo */}
          <Link
            href="/"
            className="inline-flex items-center space-x-3 group w-fit"
          >
            <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-600/25 group-hover:shadow-emerald-600/40 transition-shadow duration-300">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-3xl bg-linear-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Aukra
            </span>
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-emerald-100 to-teal-100 border border-emerald-200/50">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Premium B2B Ingredients
                </span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold text-slate-900 leading-tight">
                Nature's finest,
                <span className="block bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  crafted for excellence
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed">
                Access our curated collection of essential oils, botanical
                extracts, and natural ingredients. Login to explore exclusive
                B2B pricing and place orders.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              {[
                { icon: "🌿", title: "500+", subtitle: "Natural Ingredients" },
                { icon: "🔬", title: "ISO", subtitle: "Certified Quality" },
                { icon: "🚚", title: "72hrs", subtitle: "Sample Dispatch" },
                { icon: "🌍", title: "Global", subtitle: "Sourcing Network" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-500">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <div className="mt-auto pt-8">
            <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-slate-600">
              "Bridging traditional botanicals with contemporary cosmetic
              science."
            </blockquote>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center space-x-3 group"
              >
                <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-600/25">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl bg-linear-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  Aukra
                </span>
              </Link>
              <p className="mt-3 text-slate-500">Premium B2B Ingredients</p>
            </div>

            {/* Auth Card */}
            <div className="relative">
              {/* Card glow effect */}
              <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-4xl blur-xl opacity-20" />

              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/50 overflow-hidden">
                {/* Gradient header bar */}
                <div className="h-2 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600" />

                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 mb-4">
                      {mode === "signup" ? (
                        <User className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <Lock className="w-8 h-8 text-emerald-600" />
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {mode === "signup"
                        ? "Create Your Account"
                        : "Welcome Back"}
                    </h2>
                    <p className="mt-2 text-slate-500">
                      {mode === "signup"
                        ? "Join us to explore premium ingredients"
                        : "Sign in to continue to your account"}
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Google Sign In Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl font-medium text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/80 text-slate-400">
                        or continue with email
                      </span>
                    </div>
                  </div>

                  {/* Email/Password Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name field (only for signup) */}
                    {mode === "signup" && (
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-slate-700"
                        >
                          Full Name
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            <input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="John Doe"
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 text-slate-900 placeholder:text-slate-400"
                              autoComplete="name"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Email field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-slate-700"
                      >
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="you@company.com"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 text-slate-900 placeholder:text-slate-400"
                            autoComplete="email"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-slate-700"
                      >
                        Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 text-slate-900 placeholder:text-slate-400"
                            autoComplete={
                              mode === "signup"
                                ? "new-password"
                                : "current-password"
                            }
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      {mode === "signup" && (
                        <p className="text-xs text-slate-500">
                          Must be at least 8 characters
                        </p>
                      )}
                    </div>

                    {/* Confirm Password field (only for signup) */}
                    {mode === "signup" && (
                      <div className="space-y-2">
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-semibold text-slate-700"
                        >
                          Confirm Password
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              placeholder="••••••••"
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 text-slate-900 placeholder:text-slate-400"
                              autoComplete="new-password"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-linear-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-6"
                    >
                      {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          {mode === "signup"
                            ? "Creating Account..."
                            : "Signing In..."}
                        </span>
                      ) : mode === "signup" ? (
                        "Create Account"
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>

                  {/* Toggle Mode */}
                  <p className="text-center text-sm text-slate-500 mt-6">
                    {mode === "signup" ? (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={toggleMode}
                          className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                        >
                          Sign In
                        </button>
                      </>
                    ) : (
                      <>
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={toggleMode}
                          className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                        >
                          Create Account
                        </button>
                      </>
                    )}
                  </p>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-6 text-slate-400 mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4" />
                      <span className="text-xs">256-bit SSL</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200" />
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                      </svg>
                      <span className="text-xs">Secure Auth</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Helper function to decode Auth.js error codes
function decodeErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    OAuthSignin: "Error starting the OAuth sign in process",
    OAuthCallback: "Error handling the OAuth callback",
    OAuthCreateAccount: "Error creating OAuth account",
    EmailCreateAccount: "Error creating email account",
    Callback: "Error in the callback handler",
    OAuthAccountNotLinked:
      "This email is already associated with another account. Please sign in with your original method.",
    EmailSignin: "Error sending the email verification link",
    CredentialsSignin:
      "Invalid credentials. Please check your email and password.",
    SessionRequired: "Please sign in to access this page",
    Default: "An authentication error occurred",
  };

  return errorMessages[error] || errorMessages.Default;
}

import { Suspense } from "react";

function AuthPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-teal-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthPageLoading />}>
      <AuthContent />
    </Suspense>
  );
}
