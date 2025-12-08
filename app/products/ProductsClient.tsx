"use client";

import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import type { Product } from "@/lib/store";
import { useStore } from "@/lib/store";
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
  } = useStore();

  useEffect(() => {
    if (products.length === 0 && initialProducts.length > 0) {
      setProducts(initialProducts);
    }
  }, [products.length, initialProducts, setProducts]);

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
                addToBasket={addToBasket}
                removeFromBasket={removeFromBasket}
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
