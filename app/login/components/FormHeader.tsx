type AuthMode = "signin" | "signup";

interface FormHeaderProps {
  mode: AuthMode;
}

export function FormHeader({ mode }: FormHeaderProps) {
  return (
    <div className="text-center space-y-1.5 md:space-y-2">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900">
        {mode === "signup" ? "Create Your Account" : "Welcome Back"}
      </h2>
      <p className="text-sm md:text-base text-slate-500">
        {mode === "signup"
          ? "Join us to explore premium ingredients"
          : "Sign in to continue to your account"}
      </p>
    </div>
  );
}
