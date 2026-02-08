import { MARKETING_COPY, UI_LABELS } from "@/lib/constants";
import { Sparkles } from "lucide-react";
import { FeatureHighlights } from "./FeatureHighlights";

export function BrandingSidebar() {
  return (
    <div className="hidden lg:block self-start">
      <div className="flex-1 flex flex-col max-w-xl space-y-8">
        <div className="space-y-4 lg:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-linear-to-r from-emerald-100 to-teal-100 border border-emerald-200/50">
            <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-600" />
            <span className="text-xs lg:text-sm font-medium text-emerald-700">
              {UI_LABELS.TRUST.PREMIUM_B2B}
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 leading-tight">
            {MARKETING_COPY.LOGIN_TAGLINE.split(",")[0]},
            <span className="block bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              {MARKETING_COPY.LOGIN_TAGLINE.split(",")[1]}
            </span>
          </h1>

          <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
            {MARKETING_COPY.LOGIN_SUBTITLE}
          </p>
        </div>

        <FeatureHighlights />
      </div>

      <div className="pt-6 lg:pt-8">
        <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-sm lg:text-base text-slate-600">
          "{MARKETING_COPY.LOGIN_QUOTE}"
        </blockquote>
      </div>
    </div>
  );
}
