import { FUSE_CONFIG, STORAGE_CONFIG, STORE_CONFIG } from "@/lib/constants";
import type {
  DbProduct,
  Image,
  Product,
  Review,
  Variant,
} from "@/types/product";
import { ProductWithVariantsImagesReviews } from "@/types/product";
import Fuse from "fuse.js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useProductStore = create<
  ProductStoreState & ProductStoreActions
>()(
  persist(
    (set, get) => ({
      basket: [], // Will be hydrated from localStorage by persist middleware
      searchTerm: "",
      selectedCategory: null,
      selectedApplication: null,
      isBasketDrawerOpen: false,
      basketPendingOperations: new Set(),

      addToBasket: (productId) => {
        set((state) => {
          const newBasket = state.basket.includes(productId)
            ? state.basket
            : [...state.basket, productId];
          return { basket: newBasket };
        });
      },

      removeFromBasket: (productId) => {
        set((state) => {
          const newBasket = state.basket.filter((id) => id !== productId);
          return { basket: newBasket };
        });
      },

      clearBasket: () => {
        set({ basket: [] });
      },

      setSearchTerm: (term) => set({ searchTerm: term }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      setSelectedApplication: (appId) => set({ selectedApplication: appId }),

      setBasketDrawerOpen: (isOpen) => set({ isBasketDrawerOpen: isOpen }),

      addToBasketOptimistic: async (productId) => {
        // Optimistically add to basket
        set((state) => {
          state.basketPendingOperations.add(productId);
          const newBasket = state.basket.includes(productId)
            ? state.basket
            : [...state.basket, productId];
          return {
            basket: newBasket,
            basketPendingOperations: new Set(state.basketPendingOperations),
          };
        });

        try {
          // Simulate API call (replace with actual API call when needed)
          await new Promise((resolve) =>
            setTimeout(resolve, STORE_CONFIG.OPTIMISTIC_UPDATE_DELAY),
          );

          // On success, remove from pending
          set((state) => {
            const newPending = new Set(state.basketPendingOperations);
            newPending.delete(productId);
            return { basketPendingOperations: newPending };
          });
        } catch (error) {
          // On failure, rollback the optimistic update
          set((state) => {
            const newPending = new Set(state.basketPendingOperations);
            newPending.delete(productId);
            const newBasket = state.basket.filter((id) => id !== productId);
            return {
              basket: newBasket,
              basketPendingOperations: newPending,
            };
          });
        }
      },

      removeFromBasketOptimistic: async (productId) => {
        // Store the original basket for potential rollback
        const originalBasket = get().basket;

        // Optimistically remove from basket
        set((state) => {
          state.basketPendingOperations.add(productId);
          const newBasket = state.basket.filter((id) => id !== productId);
          return {
            basket: newBasket,
            basketPendingOperations: new Set(state.basketPendingOperations),
          };
        });

        try {
          // Simulate API call (replace with actual API call when needed)
          await new Promise((resolve) =>
            setTimeout(resolve, STORE_CONFIG.OPTIMISTIC_UPDATE_DELAY),
          );

          // On success, remove from pending
          set((state) => {
            const newPending = new Set(state.basketPendingOperations);
            newPending.delete(productId);
            return { basketPendingOperations: newPending };
          });
        } catch (error) {
          // On failure, rollback the optimistic update
          set((state) => {
            const newPending = new Set(state.basketPendingOperations);
            newPending.delete(productId);
            return {
              basket: originalBasket,
              basketPendingOperations: newPending,
            };
          });
        }
      },

      getFilteredProducts: (products: ProductWithVariantsImagesReviews[]) => {
        const state = get();

        if (!state.searchTerm) {
          // If no search term, just filter by category
          return products.filter(
            (product) =>
              !state.selectedCategory ||
              product.category === state.selectedCategory,
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
              !state.selectedCategory ||
              result.item.category === state.selectedCategory,
          )
          .map((result) => result.item);
      },

      getBasketProducts: (products: ProductWithVariantsImagesReviews[]) => {
        const state = get();
        return products.filter((product) => state.basket.includes(product.id));
      },
    }),
    {
      name: STORAGE_CONFIG.BASKET_KEY,
      partialize: (state) => ({
        basket: state.basket,
      }),
    },
  ),
);
