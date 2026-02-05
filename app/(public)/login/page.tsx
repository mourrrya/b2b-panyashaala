"use client";

import { ERROR_MESSAGES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthForm } from "./components/AuthForm";
import { AuthPageLoading } from "./components/AuthPageLoading";
import { BackgroundDecorations } from "./components/BackgroundDecorations";
import { BrandingSidebar } from "./components/BrandingSidebar";
import { ErrorMessage } from "./components/ErrorMessage";
import { FormDivider } from "./components/FormDivider";
import { FormHeader } from "./components/FormHeader";
import { GoogleSignInButton } from "./components/GoogleSignInButton";
import { ToggleMode } from "./components/ToggleMode";
import { TrustBadges } from "./components/TrustBadges";
import type { AuthMode, FormData } from "./types";
import { decodeErrorMessage } from "./utils/errorDecoder";
import { validateForm } from "./utils/validation";

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
  const [formData, setFormData] = useState<FormData>({
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm(formData, mode);
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
      setError(result.error || ERROR_MESSAGES.AUTH.AUTHENTICATION_FAILED);
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
      <BackgroundDecorations />

      <div className="relative z-10 min-h-screen max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start lg:items-center">
        <BrandingSidebar />

        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="relative">
            <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-xl sm:rounded-2xl md:rounded-4xl blur-xl opacity-20" />

            <div className="relative bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/50 overflow-hidden">
              <div className="p-4 sm:p-5 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-6">
                <FormHeader mode={mode} />
                {error && <ErrorMessage error={error} />}
                <GoogleSignInButton
                  isLoading={isLoading}
                  onClick={handleGoogleSignIn}
                />
                <FormDivider />
                <AuthForm
                  mode={mode}
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
                <ToggleMode mode={mode} onToggle={toggleMode} />
                <TrustBadges />
              </div>
            </div>
          </div>

          <div className="text-center pt-3 sm:pt-4 md:pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 text-xs md:text-sm text-slate-500 hover:text-emerald-600 transition-colors duration-300 group"
            >
              <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthPageLoading />}>
      <AuthContent />
    </Suspense>
  );
}
