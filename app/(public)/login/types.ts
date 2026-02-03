export type AuthMode = "signin" | "signup";

export interface FormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}
