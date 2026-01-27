type AuthMode = "signin" | "signup";

interface FormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export function validateForm(
  formData: FormData,
  mode: AuthMode,
): string | null {
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
}
