"use client";

import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { useApiProducts } from "@/lib/client/providers/ProductsApiProvider";
import { UI_LABELS } from "@/lib/constants";
import { useProductStore } from "@/store/productStore";
import { useMemo } from "react";

export function ProductsClient() {
  const { products, isLoading } = useApiProducts();
  const {
    basket,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    addToBasketOptimistic,
    removeFromBasketOptimistic,
    getFilteredProducts,
  } = useProductStore();

  const filteredProducts = useMemo(
    () => getFilteredProducts(products),
    [products, getFilteredProducts, searchTerm, selectedCategory],
  );

  if (isLoading) {
    return (
      <main className="bg-texture min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </main>
    );
  }

  return (
    <main className="bg-texture min-h-screen">
      <section className="bg-white/95">
        <ProductFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          setSearchTerm={setSearchTerm}
          setSelectedCategory={setSelectedCategory}
          filteredProductsCount={filteredProducts.length}
          totalProductsCount={products.length}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                basket={basket}
                addToBasket={addToBasketOptimistic}
                removeFromBasket={removeFromBasketOptimistic}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-slate-600 text-base sm:text-lg">
                {UI_LABELS.PRODUCTS_PAGE.NO_PRODUCTS_FOUND}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="mt-3 sm:mt-4 text-emerald-800 text-sm sm:text-base font-medium hover:text-emerald-900"
              >
                {UI_LABELS.PRODUCTS_PAGE.CLEAR_FILTERS}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
