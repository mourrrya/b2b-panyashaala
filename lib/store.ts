import type {
  DbProduct,
  Image,
  Product,
  Review,
  Variant,
} from "@/types/product";
import Fuse from "fuse.js";
import { create } from "zustand";
import { productListFetcher } from "./client/product";
import { transformDbProductToProduct } from "./productUtils";

// Re-export for backward compatibility
export type { DbProduct, Image, Product, Review, Variant };

// product transformation helpers moved to lib/productUtils.ts

export interface StoreState {
  products: Product[];
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

  // Actions
  setProducts: (products: Product[]) => void;
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
  getFilteredProducts: () => Product[];
  getBasketProducts: () => Product[];
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  basket: loadBasketFromStorage(), // Load basket from localStorage
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
      saveBasketToStorage(newBasket);
      return { basket: newBasket };
    });
  },

  removeFromBasket: (productId) => {
    set((state) => {
      const newBasket = state.basket.filter((id) => id !== productId);
      saveBasketToStorage(newBasket);
      return { basket: newBasket };
    });
  },

  clearBasket: () => {
    saveBasketToStorage([]);
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
      const result = await productListFetcher("/products");
      if (result.success && result.data) {
        const transformedProducts = result.data.map(
          transformDbProductToProduct
        );
        setProducts(transformedProducts);
        setLoadingProducts(false);
      } else {
        setProductsError((result as any).message || "Failed to load products");
        setLoadingProducts(false);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProductsError("Failed to load products");
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
      saveBasketToStorage(newBasket);
      return {
        basket: newBasket,
        basketPendingOperations: new Set(state.basketPendingOperations),
      };
    });

    try {
      // Simulate API call (replace with actual API call when needed)
      await new Promise((resolve) => setTimeout(resolve, 100));

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
        saveBasketToStorage(newBasket);
        return {
          basket: newBasket,
          basketPendingOperations: newPending,
        };
      });
      throw error;
    }
  },

  removeFromBasketOptimistic: async (productId) => {
    // Store the original basket for potential rollback
    const originalBasket = get().basket;

    // Optimistically remove from basket
    set((state) => {
      state.basketPendingOperations.add(productId);
      const newBasket = state.basket.filter((id) => id !== productId);
      saveBasketToStorage(newBasket);
      return {
        basket: newBasket,
        basketPendingOperations: new Set(state.basketPendingOperations),
      };
    });

    try {
      // Simulate API call (replace with actual API call when needed)
      await new Promise((resolve) => setTimeout(resolve, 100));

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
        saveBasketToStorage(originalBasket);
        return {
          basket: originalBasket,
          basketPendingOperations: newPending,
        };
      });
      throw error;
    }
  },

  getFilteredProducts: () => {
    const state = get();

    if (!state.searchTerm) {
      // If no search term, just filter by category
      return state.products.filter(
        (product) =>
          !state.selectedCategory || product.category === state.selectedCategory
      );
    }

    // Configure Fuse for fuzzy search
    const fuse = new Fuse(state.products, {
      keys: ["name", "description", "inci", "applications"],
      threshold: 0.4, // Allow for some fuzziness (0 = exact match, 1 = match anything)
      includeScore: true,
    });

    const searchResults = fuse.search(state.searchTerm);

    // Filter results by category if selected
    return searchResults
      .filter(
        (result) =>
          !state.selectedCategory ||
          result.item.category === state.selectedCategory
      )
      .map((result) => result.item);
  },

  getBasketProducts: () => {
    const state = get();
    return state.products.filter((product) =>
      state.basket.includes(product.id)
    );
  },
}));

const BASKET_STORAGE_KEY = "aukra_basket";
function loadBasketFromStorage(): (number | string)[] {
  if (typeof window === "undefined") return [];
  const BASKET_STORAGE_KEY = "aukra_basket";
  try {
    const stored = localStorage.getItem(BASKET_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading basket from storage:", error);
    return [];
  }
}

function saveBasketToStorage(basket: (number | string)[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basket));
  } catch (error) {
    console.error("Error saving basket to storage:", error);
  }
}
