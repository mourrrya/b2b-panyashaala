"use client";

import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { useStore } from "@/lib/store";

export function ProductsClient() {
  const {
    products,
    basket,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    addToBasketOptimistic,
    removeFromBasketOptimistic,
    getFilteredProducts,
  } = useStore();

  const filteredProducts = getFilteredProducts();

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
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
