"use client";

import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton, ProductGridSkeleton } from "@/components/ProductCardSkeleton";
import { ProductFilters } from "@/components/ProductFilters";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { CategoriesApiProvider } from "@/lib/client/providers/CategoriesApiProvider";
import { ProductsApiProvider, useApiProducts } from "@/lib/client/providers/ProductsApiProvider";
import { UI_LABELS } from "@/lib/constants";
import {
  useAddToBasket,
  useBasket,
  useDebouncedSearchTerm,
  useRemoveFromBasket,
  useSelectedCategory,
  useSetSearchTerm,
  useSetSelectedCategory,
} from "@/store/productStore";

/**
 * Outer wrapper that reads Zustand filter state and passes it
 * down to the ProductsApiProvider so SWR re-fetches on filter changes.
 */
export function ProductsClient() {
  const debouncedSearch = useDebouncedSearchTerm();
  const selectedCategory = useSelectedCategory();

  return (
    <CategoriesApiProvider>
      <ProductsApiProvider search={debouncedSearch || undefined} category={selectedCategory}>
        <ProductsClientInner />
      </ProductsApiProvider>
    </CategoriesApiProvider>
  );
}

function ProductsClientInner() {
  const { products, isLoading, isLoadingMore, hasMore, loadNextPage, totalProducts, error } =
    useApiProducts();

  const basket = useBasket();
  const setSearchTerm = useSetSearchTerm();
  const setSelectedCategory = useSetSelectedCategory();
  const addToBasket = useAddToBasket();
  const removeFromBasket = useRemoveFromBasket();

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadNextPage,
  });

  // Initial full-page skeleton
  if (isLoading) {
    return (
      <main className="bg-texture min-h-screen">
        <section className="bg-white/95">
          <ProductFilters filteredProductsCount={0} totalProductsCount={0} />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
            <ProductGridSkeleton count={6} />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-texture min-h-screen">
      <section className="bg-white/95">
        <ProductFilters
          filteredProductsCount={products.length}
          totalProductsCount={totalProducts}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                basket={basket}
                addToBasket={addToBasket}
                removeFromBasket={removeFromBasket}
              />
            ))}

            {/* Inline skeletons while loading more */}
            {isLoadingMore &&
              Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton key={`skeleton-${i}`} />
              ))}
          </div>

          {/* Infinite scroll sentinel */}
          {hasMore && !isLoadingMore && (
            <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
          )}

          {/* Error state for pagination */}
          {error && products.length > 0 && (
            <div className="text-center py-6">
              <p className="text-red-600 text-sm mb-2">Failed to load more products.</p>
              <button
                onClick={loadNextPage}
                className="text-emerald-800 text-sm font-medium hover:text-emerald-900"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {products.length === 0 && !isLoading && (
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

          {/* End of results */}
          {hasMore && products.length > 0 && (
            <p className="text-center text-xs text-slate-400 pt-6 pb-2">
              Showing {products.length} of {totalProducts} products
            </p>
          )}
          {!hasMore && products.length > 0 && (
            <p className="text-center text-xs text-slate-400 pt-6 pb-2">
              Showing all {products.length} of {totalProducts} products
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
