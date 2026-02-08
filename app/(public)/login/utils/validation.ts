import { ERROR_MESSAGES } from "@/lib/constants";

type AuthMode = "signin" | "signup";

interface FormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export function validateForm(formData: FormData, mode: AuthMode): string | null {
  if (!formData.email.trim()) {
    return ERROR_MESSAGES.VALIDATION.EMAIL_REQUIRED;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return ERROR_MESSAGES.VALIDATION.EMAIL_INVALID;
  }
  if (!formData.password) {
    return ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED;
  }
  if (formData.password.length < 8) {
    return ERROR_MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH;
  }
  if (mode === "signup") {
    if (!formData.name.trim()) {
      return ERROR_MESSAGES.VALIDATION.NAME_REQUIRED;
    }
    if (formData.password !== formData.confirmPassword) {
      return ERROR_MESSAGES.VALIDATION.PASSWORDS_NO_MATCH;
    }
  }
  return null;
}
