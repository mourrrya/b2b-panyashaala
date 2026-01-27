import { Mail, User } from "lucide-react";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";

type AuthMode = "signin" | "signup";

interface FormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

interface AuthFormProps {
  mode: AuthMode;
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export function AuthForm({
  mode,
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  showPassword,
  onTogglePassword,
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "signup" && (
        <FormInput
          label="Full Name"
          name="name"
          type="text"
          icon={<User className="w-5 h-5" />}
          value={formData.name}
          onChange={onInputChange}
          placeholder="John Doe"
          autoComplete="name"
        />
      )}

      <FormInput
        label="Email Address"
        name="email"
        type="email"
        icon={<Mail className="w-5 h-5" />}
        value={formData.email}
        onChange={onInputChange}
        placeholder="you@company.com"
        autoComplete="email"
        required
      />

      <PasswordInput
        label="Password"
        name="password"
        value={formData.password}
        onChange={onInputChange}
        placeholder="••••••••"
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        required
        helpText={
          mode === "signup" ? "Must be at least 8 characters" : undefined
        }
      />

      {mode === "signup" && (
        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onInputChange}
          placeholder="••••••••"
          showPassword={showPassword}
          onTogglePassword={onTogglePassword}
          autoComplete="new-password"
          required
        />
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 md:py-3.5 px-4 md:px-6 rounded-lg md:rounded-xl font-semibold text-sm md:text-base text-white bg-linear-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 md:h-5 md:w-5"
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
            {mode === "signup" ? "Creating Account..." : "Signing In..."}
          </span>
        ) : mode === "signup" ? (
          "Create Account"
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
