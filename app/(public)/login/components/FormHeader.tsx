import { UI_LABELS } from "@/lib/constants";

type AuthMode = "signin" | "signup";

interface FormHeaderProps {
  mode: AuthMode;
}

export function FormHeader({ mode }: FormHeaderProps) {
  return (
    <div className="text-center space-y-1.5 md:space-y-2">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900">
        {mode === "signup"
          ? UI_LABELS.AUTH.CREATE_ACCOUNT
          : UI_LABELS.AUTH.WELCOME_BACK}
      </h2>
      <p className="text-sm md:text-base text-slate-500">
        {mode === "signup"
          ? UI_LABELS.AUTH.SIGN_UP_SUBTITLE
          : UI_LABELS.AUTH.SIGN_IN_SUBTITLE}
      </p>
    </div>
  );
}
