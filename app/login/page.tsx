"use client";
import { useAuthStore } from "@/store/auth-store";
import { ArrowLeft, Leaf, Phone, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";

function AuthContent() {
  const router = useRouter();
  const redirectUrl = useSearchParams().get("redirect");

  const {
    otpSent,
    phoneNumber,
    resetOtp,
    otpSending: isLoading,
    onSendOtp: sendOtp,
    onVerifyOtp,
  } = useAuthStore();

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;
    await sendOtp(phone);
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get("otp") as string;
    const { success } = await onVerifyOtp(phoneNumber, token);
    if (!success) return;
    router.push(redirectUrl || "/");
  };

  const handleBackToPhone = () => {
    resetOtp();
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
                      {otpSent ? (
                        <Shield className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <Phone className="w-8 h-8 text-emerald-600" />
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {otpSent ? "Verify Your Number" : "Welcome Back"}
                    </h2>
                    <p className="mt-2 text-slate-500">
                      {otpSent
                        ? `Enter the 6-digit code sent to ${phoneNumber}`
                        : "Login with your phone number to continue"}
                    </p>
                  </div>

                  {/* Forms */}
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-slate-700"
                        >
                          Phone Number
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="+91 98765 43210"
                              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 text-slate-900 placeholder:text-slate-400"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-linear-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
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
                            Sending Code...
                          </span>
                        ) : (
                          "Send Verification Code"
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="otp"
                          className="block text-sm font-semibold text-slate-700"
                        >
                          Verification Code
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
                          <input
                            id="otp"
                            name="otp"
                            type="text"
                            placeholder="• • • • • •"
                            className="relative w-full px-4 py-4 rounded-xl border-2 border-slate-200 bg-white/50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 text-center text-2xl tracking-[0.5em] font-bold text-slate-900 placeholder:text-slate-300 placeholder:tracking-[0.3em]"
                            maxLength={6}
                            required
                          />
                        </div>
                        <p className="text-center text-sm text-slate-500 mt-2">
                          Didn't receive the code?{" "}
                          <button
                            type="button"
                            className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                          >
                            Resend
                          </button>
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-linear-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
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
                            Verifying...
                          </span>
                        ) : (
                          "Verify & Continue"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleBackToPhone}
                        disabled={isLoading}
                        className="w-full py-3 px-6 rounded-xl font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border-2 border-transparent hover:border-emerald-100 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Change Phone Number
                      </button>
                    </form>
                  )}

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/80 text-slate-400">
                        Secure authentication
                      </span>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-6 text-slate-400">
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
                      <span className="text-xs">GDPR Compliant</span>
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

export default function AuthPage() {
  return <AuthContent />;
}
