"use client";

import { useStore } from "@/lib/store";
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
  const { setSearchTerm } = useStore();

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
      className={`p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 self-baseline ${
        isSelected
          ? "bg-white/95 border-emerald-500 shadow-xl"
          : "bg-white/90 border-slate-100 hover:border-emerald-300 card-hover"
      }`}
    >
      {/* Icon and Title */}
      <div className="flex items-start gap-4 mb-3">
        {application.icon && (
          <span className="text-4xl">{application.icon}</span>
        )}
        <div className="flex-1">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            {application.category}
          </span>
          <h3 className="text-lg font-semibold text-slate-900">
            {application.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-4">{application.description}</p>

      {/* Expanded View */}
      {isSelected && (
        <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 animate-fadeIn">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">
              Key Ingredients:
            </h4>
            <div className="flex flex-wrap gap-2">
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
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Search - All Ingredients
          </button>
        </div>
      )}

      {/* Unexpanded CTA */}
      {!isSelected && (
        <div className="pt-3 border-t border-slate-100">
          <p className="text-sm text-emerald-600 font-medium">
            Click to view ingredients{" "}
          </p>
        </div>
      )}
    </div>
  );
}
