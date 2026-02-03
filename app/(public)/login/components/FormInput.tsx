import type React from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
  helpText?: string;
}

export function FormInput({
  label,
  name,
  type = "text",
  icon,
  value,
  placeholder,
  onChange,
  autoComplete,
  required = false,
  helpText,
}: FormInputProps) {
  return (
    <div className="space-y-1.5 md:space-y-2">
      <label
        htmlFor={name}
        className="block text-xs md:text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-lg md:rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
        <div className="relative">
          <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
            {icon}
          </div>
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl border-2 border-slate-200 bg-white/50 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 text-slate-900 placeholder:text-slate-400"
            autoComplete={autoComplete}
            required={required}
          />
        </div>
      </div>
      {helpText && <p className="text-xs text-slate-500">{helpText}</p>}
    </div>
  );
}
