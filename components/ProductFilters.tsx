"use client";

import { PRODUCT_CATEGORIES, UI_LABELS } from "@/lib/constants";
import { useEffect, useState } from "react";

interface ProductFiltersProps {
  searchTerm: string;
  selectedCategory: string | null;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string | null) => void;
  filteredProductsCount: number;
  totalProductsCount: number;
}

export function ProductFilters({
  searchTerm,
  selectedCategory,
  setSearchTerm,
  setSelectedCategory,
  filteredProductsCount,
  totalProductsCount,
}: ProductFiltersProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setHasScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`sticky top-14 sm:top-16 md:top-18 z-40 bg-white/95 backdrop-blur-sm transition-shadow duration-300 ${
          hasScrolled ? "shadow-md border-b border-slate-100" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="relative">
            <input
              type="text"
              placeholder={UI_LABELS.PLACEHOLDERS.SEARCH_PRODUCTS}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 border border-slate-200 rounded-lg text-sm sm:text-base text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
            <svg
              className="absolute left-2.5 sm:left-3 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-1.5 sm:space-y-2 my-3 sm:my-4 mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-emerald-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Products
          </button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? "bg-emerald-800 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Showing {filteredProductsCount} of {totalProductsCount} products
        </p>
      </div>
    </>
  );
}
