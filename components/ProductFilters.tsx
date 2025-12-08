"use client";

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

  const categories = [
    { value: "essential-oil", label: "Essential Oils" },
    { value: "fixed-oil", label: "Fixed/Carrier Oils" },
    { value: "extract", label: "Plant Extracts" },
    { value: "hydrosol", label: "Hydrosols" },
  ];

  return (
    <>
      <div
        className={`sticky top-[72px] z-40 bg-white/95 backdrop-blur-sm transition-shadow duration-300 ${
          hasScrolled ? "shadow-md border-b border-slate-100" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by product name, INCI, or application..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
            <svg
              className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"
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
      <div className="max-w-6xl mx-auto px-6 space-y-2 my-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === null
                ? "bg-emerald-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === cat.value
                  ? "bg-emerald-800 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-slate-600">
          Showing {filteredProductsCount} of {totalProductsCount} products
        </p>
      </div>
    </>
  );
}
