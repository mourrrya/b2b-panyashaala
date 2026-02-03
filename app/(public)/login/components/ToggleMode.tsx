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
          Already have an account?{" "}
          <button
            type="button"
            onClick={onToggle}
            className="text-emerald-600 cursor-pointer font-semibold hover:text-emerald-700 transition-colors"
          >
            Sign In
          </button>
        </>
      ) : (
        <>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onToggle}
            className="text-emerald-600 cursor-pointer font-semibold hover:text-emerald-700 transition-colors"
          >
            Create Account
          </button>
        </>
      )}
    </p>
  );
}
