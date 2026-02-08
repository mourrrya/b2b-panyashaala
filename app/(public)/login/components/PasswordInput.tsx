import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  autoComplete?: string;
  required?: boolean;
  helpText?: string;
}

export function PasswordInput({
  label,
  name,
  value,
  placeholder,
  onChange,
  showPassword,
  onTogglePassword,
  autoComplete,
  required = false,
  helpText,
}: PasswordInputProps) {
  return (
    <div className="space-y-1.5 md:space-y-2">
      <label htmlFor={name} className="block text-xs md:text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-lg md:rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
        <div className="relative">
          <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
          <input
            id={name}
            name={name}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl border-2 border-slate-200 bg-white/50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 text-slate-900 placeholder:text-slate-400"
            autoComplete={autoComplete}
            required={required}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Eye className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </button>
        </div>
      </div>
      {helpText && <p className="text-xs text-slate-500">{helpText}</p>}
    </div>
  );
}
