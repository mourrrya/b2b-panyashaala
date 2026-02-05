import {
  ERROR_MESSAGES,
  FUSE_CONFIG,
  STORAGE_CONFIG,
  STORE_CONFIG,
} from "@/lib/constants";
import { PUBLIC_ROUTES } from "@/lib/constants/routes";
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
import { productListFetcher } from "../lib/client/apiCalling/product";

// Re-export for backward compatibility
export type { DbProduct, Image, Product, Review, Variant };

// product transformation helpers moved to lib/productUtils.ts

export interface ProductStoreState {
  products: ProductWithVariantsImagesReviews[];
  basket: (number | string)[]; // Support both number and string IDs
  searchTerm: string;
  selectedCategory: string | null;
  selectedApplication: number | null;
  isBasketDrawerOpen: boolean;
  // Loading and error states
  isLoadingProducts: boolean;
  productsError: string | null;
  // Basket optimistic update states
  basketPendingOperations: Set<string | number>;
}

export interface ProductStoreActions {
  // Actions
  setProducts: (products: ProductWithVariantsImagesReviews[]) => void;
  addToBasket: (productId: number | string) => void;
  removeFromBasket: (productId: number | string) => void;
  clearBasket: () => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedApplication: (appId: number | null) => void;
  setBasketDrawerOpen: (isOpen: boolean) => void;

  // Loading and error actions
  setLoadingProducts: (loading: boolean) => void;
  setProductsError: (error: string | null) => void;

  // Initialize products
  initialize: () => Promise<void>;

  // Optimistic update actions
  addToBasketOptimistic: (productId: number | string) => Promise<void>;
  removeFromBasketOptimistic: (productId: number | string) => Promise<void>;

  // Selectors
  getFilteredProducts: () => ProductWithVariantsImagesReviews[];
  getBasketProducts: () => ProductWithVariantsImagesReviews[];
}

export const useProductStore = create<
  ProductStoreState & ProductStoreActions
>()(
  persist(
    (set, get) => ({
      products: [],
      basket: [], // Will be hydrated from localStorage by persist middleware
      searchTerm: "",
      selectedCategory: null,
      selectedApplication: null,
      isBasketDrawerOpen: false,
      isLoadingProducts: false,
      productsError: null,
      basketPendingOperations: new Set(),

      setProducts: (products) => set({ products }),

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

      setLoadingProducts: (loading) => set({ isLoadingProducts: loading }),

      setProductsError: (error) => set({ productsError: error }),

      initialize: async () => {
        const { setLoadingProducts, setProductsError, setProducts } = get();
        setLoadingProducts(true);
        setProductsError(null);
        try {
          const result = await productListFetcher(PUBLIC_ROUTES.PRODUCTS.LIST);
          if (result.success && result.data) {
            setProducts(result.data);
            setLoadingProducts(false);
          } else {
            setProductsError(
              (result as any).message || ERROR_MESSAGES.PRODUCT.LOAD_FAILED,
            );
            setLoadingProducts(false);
          }
        } catch (error) {
          console.error(ERROR_MESSAGES.PRODUCT.LOAD_FAILED, error);
          setProductsError(ERROR_MESSAGES.PRODUCT.LOAD_FAILED);
          setLoadingProducts(false);
        }
      },

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

      getFilteredProducts: () => {
        const state = get();

        if (!state.searchTerm) {
          // If no search term, just filter by category
          return state.products.filter(
            (product) =>
              !state.selectedCategory ||
              product.category === state.selectedCategory,
          );
        }

        // Configure Fuse for fuzzy search
        const fuse = new Fuse(state.products, {
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

      getBasketProducts: () => {
        const state = get();
        return state.products.filter((product) =>
          state.basket.includes(product.id),
        );
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
