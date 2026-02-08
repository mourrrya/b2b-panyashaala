import { UI_LABELS } from "@/lib/constants";

type AuthMode = "signin" | "signup";

interface ToggleModeProps {
  mode: AuthMode;
  onToggle: () => void;
}

export function ToggleMode({ mode, onToggle }: ToggleModeProps) {
  return (
    <p className="text-center text-xs md:text-sm text-slate-500">
      {mode === "signup" ? (
        <>
          {UI_LABELS.AUTH.ALREADY_HAVE_ACCOUNT}{" "}
          <button
            type="button"
            onClick={onToggle}
            className="text-emerald-600 cursor-pointer font-semibold hover:text-emerald-700 transition-colors"
          >
            {UI_LABELS.ACTIONS.SIGN_IN}
          </button>
        </>
      ) : (
        <>
          {UI_LABELS.AUTH.DONT_HAVE_ACCOUNT}{" "}
          <button
            type="button"
            onClick={onToggle}
            className="text-emerald-600 cursor-pointer font-semibold hover:text-emerald-700 transition-colors"
          >
            {UI_LABELS.ACTIONS.SIGN_UP}
          </button>
        </>
      )}
    </p>
  );
}
