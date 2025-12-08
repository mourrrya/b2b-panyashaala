"use client";

import { generateProductSlug } from "@/lib/seo";
import type { Product } from "@/lib/store";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useEffect } from "react";

interface ProductsClientProps {
  initialProducts: Product[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const {
    products,
    basket,
    searchTerm,
    selectedCategory,
    setProducts,
    setSearchTerm,
    setSelectedCategory,
    addToBasket,
    removeFromBasket,
    getFilteredProducts,
    getBasketProducts,
  } = useStore();

  useEffect(() => {
    if (products.length === 0 && initialProducts.length > 0) {
      setProducts(initialProducts);
    }
  }, [products.length, initialProducts, setProducts]);

  const categories = [
    { value: "essential-oil", label: "Essential Oils" },
    { value: "fixed-oil", label: "Fixed/Carrier Oils" },
    { value: "extract", label: "Plant Extracts" },
    { value: "hydrosol", label: "Hydrosols" },
  ];

  const filteredProducts = getFilteredProducts();
  const basketProducts = getBasketProducts();

  return (
    <main className="bg-texture min-h-screen">
      <section className="bg-white/95 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 space-y-6">
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
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${generateProductSlug(
                      product.name,
                      product.id
                    )}`}
                    className="p-6 rounded-2xl border border-slate-100 bg-white card-hover cursor-pointer transition-all hover:border-emerald-200 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {product.name}
                      </h3>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                        {
                          categories.find((c) => c.value === product.category)
                            ?.label
                        }
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      {product.description}
                    </p>
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        <span className="font-medium">INCI:</span>{" "}
                        {product.inci}
                      </p>
                      <p className="text-xs text-emerald-700 font-medium">
                        <span className="block text-slate-600 font-normal">
                          Applications:
                        </span>
                        {product.applications}
                      </p>
                    </div>
                    {(() => {
                      const isInBasket = basket.includes(product.id);
                      return (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (isInBasket) {
                              removeFromBasket(product.id);
                            } else {
                              addToBasket(product.id);
                            }
                          }}
                          className={`mt-4 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isInBasket
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          }`}
                        >
                          {isInBasket ? (
                            <>
                              <svg
                                className="inline w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Added to Enquiry
                            </>
                          ) : (
                            "Add to Enquiry"
                          )}
                        </button>
                      );
                    })()}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white/95 rounded-3xl border border-slate-100 p-6 sticky top-28 h-fit">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Enquiry Basket ({basket.length})
              </h3>
              {basket.length > 0 ? (
                <>
                  <ul className="text-sm text-slate-600 space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {basketProducts.map((product) => (
                      <li
                        key={product.id}
                        className="flex justify-between items-start py-2 border-b border-slate-100 last:border-0"
                      >
                        <span className="font-medium text-slate-900">
                          {product.name}
                        </span>
                        <button
                          onClick={() => removeFromBasket(product.id)}
                          className="text-emerald-700 hover:text-emerald-900 font-semibold text-lg leading-none"
                          title="Remove from basket"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="w-full block px-4 py-3 text-center bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
                  >
                    Send Enquiry
                  </Link>
                </>
              ) : (
                <p className="text-sm text-slate-500">No products added yet.</p>
              )}
            </div>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
                No products found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="mt-4 text-emerald-800 font-medium hover:text-emerald-900"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
