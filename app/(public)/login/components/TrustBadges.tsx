import { UI_LABELS } from "@/lib/constants";
import { Shield } from "lucide-react";

export function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-6 text-slate-400 pt-4 md:pt-6 border-t border-slate-100">
      <div className="flex items-center gap-1 md:gap-1.5">
        <Shield className="w-3 h-3 md:w-4 md:h-4" />
        <span className="text-xs">{UI_LABELS.TRUST.SSL}</span>
      </div>
      <div className="w-px h-3 md:h-4 bg-slate-200" />
      <div className="flex items-center gap-1 md:gap-1.5">
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
        </svg>
        <span className="text-xs">{UI_LABELS.TRUST.SECURE_AUTH}</span>
      </div>
    </div>
  );
}
