"use client";

import { getProductsData } from "@/lib/productData";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

export default function ProductsPage() {
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
    if (products.length === 0) {
      const productsData = getProductsData();
      setProducts(productsData);
    }
  }, [products.length, setProducts]);

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
                  <div
                    key={product.id}
                    className="p-6 rounded-2xl border border-slate-100 bg-white card-hover cursor-pointer"
                    onClick={() => addToBasket(product.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {product.name}
                      </h3>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
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
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/95 rounded-3xl border border-slate-100 p-6 sticky top-28 h-fit">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Enquiry Basket ({basket.length})
              </h3>
              {basket.length > 0 ? (
                <ul className="text-sm text-slate-600 space-y-2">
                  {basketProducts.map((product) => (
                    <li
                      key={product.id}
                      className="flex justify-between items-start"
                    >
                      <span>{product.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromBasket(product.id);
                        }}
                        className="text-emerald-700 hover:text-emerald-900 font-semibold"
                      ></button>
                    </li>
                  ))}
                </ul>
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
