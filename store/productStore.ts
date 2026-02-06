import { STORAGE_CONFIG } from "@/lib/constants";
import type { DbProduct, Image, Product, Review, Variant } from "@/types/product";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Re-export for backward compatibility
export type { DbProduct, Image, Product, Review, Variant };

// product transformation helpers moved to lib/productUtils.ts

export interface ProductStoreState {
  basket: (number | string)[]; // Support both number and string IDs
  searchTerm: string;
  debouncedSearchTerm: string;
  selectedCategory: string | null;
  selectedUsage: string | null;
  isBasketDrawerOpen: boolean;
}

export interface ProductStoreActions {
  // Basket actions
  addToBasket: (productId: number | string) => void;
  removeFromBasket: (productId: number | string) => void;
  removeMultipleFromBasket: (productIds: (number | string)[]) => void;
  clearBasket: () => void;

  // Filter actions
  setSearchTerm: (term: string) => void;
  setDebouncedSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedUsage: (usage: string | null) => void;

  // Drawer actions
  setBasketDrawerOpen: (isOpen: boolean) => void;
}

type ProductStore = ProductStoreState & ProductStoreActions;

export const useProductStore = create<ProductStore>()(
  devtools(
    persist(
      immer((set) => ({
        basket: [],
        searchTerm: "",
        debouncedSearchTerm: "",
        selectedCategory: null,
        selectedUsage: null,
        isBasketDrawerOpen: false,

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

        removeMultipleFromBasket: (productIds) => {
          set((state) => {
            const idsToRemove = new Set(productIds.map(String));
            state.basket = state.basket.filter((id) => !idsToRemove.has(String(id)));
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

        setDebouncedSearchTerm: (term) => {
          set((state) => {
            state.debouncedSearchTerm = term;
          });
        },

        setSelectedCategory: (category) => {
          set((state) => {
            state.selectedCategory = category;
          });
        },

        setSelectedUsage: (usage) => {
          set((state) => {
            state.selectedUsage = usage;
          });
        },

        setBasketDrawerOpen: (isOpen) => {
          set((state) => {
            state.isBasketDrawerOpen = isOpen;
          });
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

// Basket action selectors
export const useAddToBasket = () => useProductStore((s) => s.addToBasket);
export const useRemoveFromBasket = () => useProductStore((s) => s.removeFromBasket);
export const useRemoveMultipleFromBasket = () => useProductStore((s) => s.removeMultipleFromBasket);
export const useClearBasket = () => useProductStore((s) => s.clearBasket);

// Basket drawer selectors
export const useIsBasketDrawerOpen = () => useProductStore((s) => s.isBasketDrawerOpen);
export const useSetBasketDrawerOpen = () => useProductStore((s) => s.setBasketDrawerOpen);

// Filter state selectors
export const useSearchTerm = () => useProductStore((s) => s.searchTerm);
export const useDebouncedSearchTerm = () => useProductStore((s) => s.debouncedSearchTerm);
export const useSelectedCategory = () => useProductStore((s) => s.selectedCategory);
export const useSelectedUsage = () => useProductStore((s) => s.selectedUsage);

// Filter action selectors
export const useSetSearchTerm = () => useProductStore((s) => s.setSearchTerm);
export const useSetDebouncedSearchTerm = () => useProductStore((s) => s.setDebouncedSearchTerm);
export const useSetSelectedCategory = () => useProductStore((s) => s.setSelectedCategory);
export const useSetSelectedUsage = () => useProductStore((s) => s.setSelectedUsage);
