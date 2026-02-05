import { FUSE_CONFIG, STORAGE_CONFIG, STORE_CONFIG } from "@/lib/constants";
import type { DbProduct, Image, Product, Review, Variant } from "@/types/product";
import { ProductWithVariantsImagesReviews } from "@/types/product";
import Fuse from "fuse.js";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Re-export for backward compatibility
export type { DbProduct, Image, Product, Review, Variant };

// product transformation helpers moved to lib/productUtils.ts

export interface ProductStoreState {
  basket: (number | string)[]; // Support both number and string IDs
  searchTerm: string;
  selectedCategory: string | null;
  selectedApplication: number | null;
  isBasketDrawerOpen: boolean;
  // Basket optimistic update states
  basketPendingOperations: Set<string | number>;
}

export interface ProductStoreActions {
  // Actions
  addToBasket: (productId: number | string) => void;
  removeFromBasket: (productId: number | string) => void;
  clearBasket: () => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedApplication: (appId: number | null) => void;
  setBasketDrawerOpen: (isOpen: boolean) => void;

  // Optimistic update actions
  addToBasketOptimistic: (productId: number | string) => Promise<void>;
  removeFromBasketOptimistic: (productId: number | string) => Promise<void>;

  // Selectors (now accept products as parameter)
  getFilteredProducts: (
    products: ProductWithVariantsImagesReviews[],
  ) => ProductWithVariantsImagesReviews[];
  getBasketProducts: (
    products: ProductWithVariantsImagesReviews[],
  ) => ProductWithVariantsImagesReviews[];
}

type ProductStore = ProductStoreState & ProductStoreActions;

export const useProductStore = create<ProductStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        basket: [], // Will be hydrated from localStorage by persist middleware
        searchTerm: "",
        selectedCategory: null,
        selectedApplication: null,
        isBasketDrawerOpen: false,
        basketPendingOperations: new Set(),

        addToBasket: (productId) => {
          set((state) => {
            if (!state.basket.includes(productId)) {
              state.basket.push(productId);
            }
          });
        },

        removeFromBasket: (productId) => {
          set((state) => {
            state.basket = state.basket.filter((id) => id !== productId);
          });
        },

        clearBasket: () => {
          set((state) => {
            state.basket = [];
          });
        },

        setSearchTerm: (term) => {
          set((state) => {
            state.searchTerm = term;
          });
        },

        setSelectedCategory: (category) => {
          set((state) => {
            state.selectedCategory = category;
          });
        },

        setSelectedApplication: (appId) => {
          set((state) => {
            state.selectedApplication = appId;
          });
        },

        setBasketDrawerOpen: (isOpen) => {
          set((state) => {
            state.isBasketDrawerOpen = isOpen;
          });
        },

        addToBasketOptimistic: async (productId) => {
          // Optimistically add to basket
          set((state) => {
            state.basketPendingOperations.add(productId);
            if (!state.basket.includes(productId)) {
              state.basket.push(productId);
            }
          });

          try {
            // Simulate API call (replace with actual API call when needed)
            await new Promise((resolve) =>
              setTimeout(resolve, STORE_CONFIG.OPTIMISTIC_UPDATE_DELAY),
            );

            // On success, remove from pending
            set((state) => {
              state.basketPendingOperations.delete(productId);
            });
          } catch (error) {
            // On failure, rollback the optimistic update
            set((state) => {
              state.basketPendingOperations.delete(productId);
              state.basket = state.basket.filter((id) => id !== productId);
            });
          }
        },

        removeFromBasketOptimistic: async (productId) => {
          // Store the original basket for potential rollback
          const originalBasket = get().basket;

          // Optimistically remove from basket
          set((state) => {
            state.basketPendingOperations.add(productId);
            state.basket = state.basket.filter((id) => id !== productId);
          });

          try {
            // Simulate API call (replace with actual API call when needed)
            await new Promise((resolve) =>
              setTimeout(resolve, STORE_CONFIG.OPTIMISTIC_UPDATE_DELAY),
            );

            // On success, remove from pending
            set((state) => {
              state.basketPendingOperations.delete(productId);
            });
          } catch (error) {
            // On failure, rollback the optimistic update
            set((state) => {
              state.basketPendingOperations.delete(productId);
              state.basket = originalBasket;
            });
          }
        },

        getFilteredProducts: (products: ProductWithVariantsImagesReviews[]) => {
          const state = get();

          if (!state.searchTerm) {
            // If no search term, just filter by category
            return products.filter(
              (product) => !state.selectedCategory || product.category === state.selectedCategory,
            );
          }

          // Configure Fuse for fuzzy search
          const fuse = new Fuse(products, {
            keys: [...FUSE_CONFIG.SEARCH_KEYS],
            threshold: FUSE_CONFIG.SEARCH_THRESHOLD,
            includeScore: FUSE_CONFIG.INCLUDE_SCORE,
          });

          const searchResults = fuse.search(state.searchTerm);

          // Filter results by category if selected
          return searchResults
            .filter(
              (result) =>
                !state.selectedCategory || result.item.category === state.selectedCategory,
            )
            .map((result) => result.item);
        },

        getBasketProducts: (products: ProductWithVariantsImagesReviews[]) => {
          const state = get();
          return products.filter((product) => state.basket.includes(product.id));
        },
      })),
      {
        name: STORAGE_CONFIG.BASKET_KEY,
        partialize: (state) => ({
          basket: state.basket,
        }),
      },
    ),
    { name: "product-store" },
  ),
);

// ============================================================================
// Selectors & Convenience Hooks
// ============================================================================

// Basket state selectors
export const useBasket = () => useProductStore((s) => s.basket);
export const useBasketLength = () => useProductStore((s) => s.basket.length);
export const useBasketPendingOperations = () => useProductStore((s) => s.basketPendingOperations);

// Basket action selectors
export const useAddToBasket = () => useProductStore((s) => s.addToBasket);
export const useRemoveFromBasket = () => useProductStore((s) => s.removeFromBasket);
export const useClearBasket = () => useProductStore((s) => s.clearBasket);
export const useAddToBasketOptimistic = () => useProductStore((s) => s.addToBasketOptimistic);
export const useRemoveFromBasketOptimistic = () =>
  useProductStore((s) => s.removeFromBasketOptimistic);

// Basket drawer selectors
export const useIsBasketDrawerOpen = () => useProductStore((s) => s.isBasketDrawerOpen);
export const useSetBasketDrawerOpen = () => useProductStore((s) => s.setBasketDrawerOpen);

// Filter state selectors
export const useSearchTerm = () => useProductStore((s) => s.searchTerm);
export const useSelectedCategory = () => useProductStore((s) => s.selectedCategory);
export const useSelectedApplication = () => useProductStore((s) => s.selectedApplication);

// Filter action selectors
export const useSetSearchTerm = () => useProductStore((s) => s.setSearchTerm);
export const useSetSelectedCategory = () => useProductStore((s) => s.setSelectedCategory);
export const useSetSelectedApplication = () => useProductStore((s) => s.setSelectedApplication);

// Product query selectors
export const useGetFilteredProducts = () => useProductStore((s) => s.getFilteredProducts);
export const useGetBasketProducts = () => useProductStore((s) => s.getBasketProducts);
