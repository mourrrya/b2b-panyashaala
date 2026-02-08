# Store Architecture

## Overview

Zustand stores with Immer middleware for simple, type-safe state management.

## Stack

- **Zustand** - Lightweight state management
- **Immer** - Mutable-style immutable updates
- **Persist** - LocalStorage persistence
- **Devtools** - Redux DevTools integration

## Pattern

### Store Structure

```typescript
export const useStore = create<Store>()(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        items: [],
        filters: {},

        // Actions - mutate state directly with Immer
        addItem: (item) => {
          set((state) => {
            state.items.push(item); // Direct mutation ✅
          });
        },

        updateFilter: (key, value) => {
          set((state) => {
            state.filters[key] = value; // Direct mutation ✅
          });
        },
      })),
      { name: "storage-key", partialize: (state) => ({ items: state.items }) },
    ),
    { name: "store-name" },
  ),
);

// Selectors - granular subscriptions
export const useItems = () => useStore((s) => s.items);
export const useAddItem = () => useStore((s) => s.addItem);
```

### Usage in Components

```typescript
function Component() {
  // ✅ Only re-renders when items change
  const items = useItems();
  const addItem = useAddItem(); // No re-renders (action only)

  // ❌ Avoid - re-renders on ANY store change
  // const { items, addItem } = useStore();

  return <button onClick={() => addItem(item)}>Add</button>;
}
```

## Example Product Store

### State

```typescript
{
  basket: (number | string)[];           // Product IDs in basket
  searchTerm: string;                    // Search query
  selectedCategory: string | null;       // Category filter
  selectedApplication: number | null;    // Application filter
  isBasketDrawerOpen: boolean;           // Drawer visibility
  basketPendingOperations: Set<number>;  // Optimistic updates
}
```

### Selectors

**Basket:**

- `useBasket()` - Items array
- `useBasketLength()` - Count
- `useAddToBasket()` / `useRemoveFromBasket()` / `useClearBasket()`
- `useAddToBasketOptimistic()` / `useRemoveFromBasketOptimistic()`

**Filters:**

- `useSearchTerm()` / `useSetSearchTerm()`
- `useSelectedCategory()` / `useSetSelectedCategory()`
- `useSelectedApplication()` / `useSetSelectedApplication()`

**Drawer:**

- `useIsBasketDrawerOpen()` / `useSetBasketDrawerOpen()`

**Queries:**

- `useGetFilteredProducts()` - Fuzzy search + filter
- `useGetBasketProducts()` - Get basket items

## Rules

1. **Always use selectors** - Never `useStore()` directly in components
2. **Mutate with Immer** - Write normal JavaScript in `set()`
3. **Granular subscriptions** - One hook per state slice
4. **Action-only hooks** - Never re-render for actions
5. **Persist critical data** - Use `partialize` for localStorage

## Performance

| Hook               | Re-renders When         |
| ------------------ | ----------------------- |
| `useBasket()`      | Basket changes          |
| `useSearchTerm()`  | Search term changes     |
| `useAddToBasket()` | **Never** (action only) |
| `useStore()`       | **ANY** change ❌       |

## Middleware Order

```typescript
devtools(persist(immer(...), persistConfig), devtoolsConfig);
```

Order matters: Devtools → Persist → Immer

## Files

- `store/productStore.ts` - Product & basket state
- Pattern applies to all future stores (orders, cart, etc.)
