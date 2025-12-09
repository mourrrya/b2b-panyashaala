import Fuse from "fuse.js";
import { create } from "zustand";

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  inci: string;
  applications: string;
}

export interface StoreState {
  products: Product[];
  basket: number[];
  searchTerm: string;
  selectedCategory: string | null;
  selectedApplication: number | null;
  isBasketDrawerOpen: boolean;

  // Actions
  setProducts: (products: Product[]) => void;
  addToBasket: (productId: number) => void;
  removeFromBasket: (productId: number) => void;
  clearBasket: () => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedApplication: (appId: number | null) => void;
  setBasketDrawerOpen: (isOpen: boolean) => void;

  // Selectors
  getFilteredProducts: () => Product[];
  getBasketProducts: () => Product[];
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  basket: [],
  searchTerm: "",
  selectedCategory: null,
  selectedApplication: null,
  isBasketDrawerOpen: false,

  setProducts: (products) => set({ products }),

  addToBasket: (productId) =>
    set((state) => ({
      basket: state.basket.includes(productId)
        ? state.basket
        : [...state.basket, productId],
    })),

  removeFromBasket: (productId) =>
    set((state) => ({
      basket: state.basket.filter((id) => id !== productId),
    })),

  clearBasket: () => set({ basket: [] }),

  setSearchTerm: (term) => set({ searchTerm: term }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setSelectedApplication: (appId) => set({ selectedApplication: appId }),

  setBasketDrawerOpen: (isOpen) => set({ isBasketDrawerOpen: isOpen }),

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
