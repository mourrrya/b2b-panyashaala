"use client";

import { UI_LABELS } from "@/lib/constants";
import { useSetSearchTerm } from "@/store/productStore";
import { useRouter } from "next/navigation";
import { Application } from "../data/applications";

interface ApplicationCardProps {
  application: Application;
  index: number;
  isSelected: boolean;
  onToggle: (index: number | null) => void;
}

export function ApplicationCard({
  application,
  index,
  isSelected,
  onToggle,
}: ApplicationCardProps) {
  const router = useRouter();
  const setSearchTerm = useSetSearchTerm();

  const handleClick = () => {
    onToggle(isSelected ? null : index);
  };

  const handleIngredientClick = (e: React.MouseEvent, ingredient: string) => {
    e.stopPropagation();
    setSearchTerm(ingredient);
    router.push("/products");
  };

  const handleQuickEnquiry = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    setSearchTerm(title);
    router.push("/products");
  };

  return (
    <div
      onClick={handleClick}
      className={`p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 self-baseline ${
        isSelected
          ? "bg-white/95 border-emerald-500 shadow-xl"
          : "bg-white/90 border-slate-100 hover:border-emerald-300 card-hover"
      }`}
    >
      {/* Icon and Title */}
      <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
        {application.icon && (
          <span className="text-2xl sm:text-3xl lg:text-4xl">
            {application.icon}
          </span>
        )}
        <div className="flex-1">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-1.5 sm:mb-2">
            {application.category}
          </span>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            {application.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
        {application.description}
      </p>

      {/* Expanded View */}
      {isSelected && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 space-y-3 sm:space-y-4 animate-fadeIn">
          <div>
            <h4 className="font-semibold text-sm sm:text-base text-slate-900 mb-2 sm:mb-3">
              {UI_LABELS.APPLICATIONS.KEY_INGREDIENTS}
            </h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {application.ingredients.map((ingredient, iIdx) => (
                <button
                  key={iIdx}
                  onClick={(e) => handleIngredientClick(e, ingredient)}
                  className="tag-pill"
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={(e) => handleQuickEnquiry(e, application.title)}
            className="w-full mt-3 sm:mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors"
          >
            {UI_LABELS.APPLICATIONS.SEARCH_ALL_INGREDIENTS}
          </button>
        </div>
      )}

      {/* Unexpanded CTA */}
      {!isSelected && (
        <div className="pt-2 sm:pt-3 border-t border-slate-100">
          <p className="text-xs sm:text-sm text-emerald-600 font-medium">
            {UI_LABELS.APPLICATIONS.CLICK_TO_VIEW}{" "}
          </p>
        </div>
      )}
    </div>
  );
}
