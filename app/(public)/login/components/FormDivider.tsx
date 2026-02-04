import { UI_LABELS } from "@/lib/constants";

export function FormDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center text-xs md:text-sm">
        <span className="px-3 md:px-4 bg-white/80 text-slate-400">
          {UI_LABELS.AUTH.OR_DIVIDER}
        </span>
      </div>
    </div>
  );
}
