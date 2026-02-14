"use client";

import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton, ProductGridSkeleton } from "@/components/ProductCardSkeleton";
import { VirtualizedGrid, useGridColumns } from "@/components/VirtualizedGrid";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useApiCollectionProducts } from "@/lib/client/providers/CollectionsApiProvider";
import { PUBLIC_NAV, UI_LABELS } from "@/lib/constants";
import { useAddToBasket, useBasket, useRemoveFromBasket } from "@/store/productStore";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CollectionProductsClientProps {
  collectionName: string;
}

export function CollectionProductsClient({ collectionName }: CollectionProductsClientProps) {
  const {
    collection,
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    loadNextPage,
    totalProducts,
    error,
  } = useApiCollectionProducts();

  const basket = useBasket();
  const addToBasket = useAddToBasket();
  const removeFromBasket = useRemoveFromBasket();
  const columns = useGridColumns();

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadNextPage,
  });

  // ---------------------------------------------------------------------------
  // LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <main className="bg-texture min-h-screen">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
          <CollectionHeader name={collectionName} />
          <ProductGridSkeleton count={6} />
        </section>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // ERROR / NOT FOUND STATE
  // ---------------------------------------------------------------------------
  if (error && products.length === 0) {
    return (
      <main className="bg-texture min-h-screen">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
          <CollectionHeader name={collectionName} />
          <div className="text-center py-16">
            <p className="text-lg text-slate-600 mb-2">
              {UI_LABELS.APPLICATIONS.COLLECTION_NOT_FOUND}
            </p>
            <p className="text-sm text-slate-500 mb-6">
              {UI_LABELS.APPLICATIONS.COLLECTION_NOT_FOUND_SUBTITLE}
            </p>
            <Link
              href="/applications"
              className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
            >
              {UI_LABELS.APPLICATIONS.BACK_TO_COLLECTIONS}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <main className="bg-texture min-h-screen">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
        <CollectionHeader
          name={collection?.name ?? collectionName}
          description={collection?.description}
        />

        {/* Empty state */}
        {products.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-lg text-slate-600 mb-2">{UI_LABELS.APPLICATIONS.NO_PRODUCTS}</p>
            <p className="text-sm text-slate-500 mb-6">
              {UI_LABELS.APPLICATIONS.NO_PRODUCTS_SUBTITLE}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              {UI_LABELS.APPLICATIONS.BROWSE_ALL}
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <>
            <VirtualizedGrid
              items={products}
              renderItem={(product) => (
                <ProductCard
                  showApplications={false}
                  product={product}
                  basket={basket}
                  addToBasket={addToBasket}
                  removeFromBasket={removeFromBasket}
                />
              )}
              keyExtractor={(product) => product.id}
              estimateRowHeight={280}
              overscan={3}
            />

            {/* Inline skeletons while loading more */}
            {isLoadingMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full mt-3 sm:mt-4 lg:mt-6">
                {Array.from({ length: columns }).map((_, i) => (
                  <ProductCardSkeleton key={`skeleton-${i}`} />
                ))}
              </div>
            )}

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
                  {UI_LABELS.APPLICATIONS.RETRY}
                </button>
              </div>
            )}

            {/* Pagination status */}
            {hasMore && products.length > 0 && (
              <p className="text-center text-xs text-slate-400 pt-6 pb-2">
                {UI_LABELS.APPLICATIONS.SHOWING_PRODUCTS} {products.length}{" "}
                {UI_LABELS.APPLICATIONS.OF_PRODUCTS} {totalProducts}{" "}
                {UI_LABELS.APPLICATIONS.PRODUCTS_COUNT}
              </p>
            )}
            {!hasMore && products.length > 0 && (
              <p className="text-center text-xs text-slate-400 pt-6 pb-2">
                {UI_LABELS.APPLICATIONS.ALL_PRODUCTS_SHOWN} {products.length}{" "}
                {UI_LABELS.APPLICATIONS.OF_PRODUCTS} {totalProducts}{" "}
                {UI_LABELS.APPLICATIONS.PRODUCTS_COUNT}
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}

// =============================================================================
// COLLECTION HEADER
// =============================================================================

function CollectionHeader({ name, description }: { name: string; description?: string | null }) {
  return (
    <div className="mb-8 sm:mb-10 lg:mb-12">
      <Link
        href={PUBLIC_NAV.APPLICATIONS}
        className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors mb-4 sm:mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {UI_LABELS.APPLICATIONS.BACK_TO_COLLECTIONS}
      </Link>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 mb-3 sm:mb-4 capitalize">
        {name}
      </h1>

      {description && (
        <p className="text-sm sm:text-base lg:text-lg text-slate-600 capitalize">{description}</p>
      )}
    </div>
  );
}
