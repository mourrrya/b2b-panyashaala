# API Architecture

A lightweight API layer using **Axios** + **SWR** + **React Context Providers**, with page-specific data fetching. Routes and SWR config centralized in `lib/constants/routes.ts`.

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Page Components                             │
├─────────────────────────────────────────────────────────────────┤
│    useApiProducts() / useApiProfile() / useApiOrders()           │
├─────────────────────────────────────────────────────────────────┤
│  ProductsProvider / ProfileProvider / OrdersProvider (per-page)  │
├─────────────────────────────────────────────────────────────────┤
│                    SWR (caching + deduplication)                 │
├─────────────────────────────────────────────────────────────────┤
│                      Axios Client (apiClient)                    │
├─────────────────────────────────────────────────────────────────┤
│                       /api/* Routes                              │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
lib/client/
├── api/
│   └── axios.ts              # Axios instance + interceptors + swrFetcher
└── providers/
    ├── ProductsApiProvider.tsx  # Products context + useApiProducts hook
    ├── ProfileApiProvider.tsx   # Profile context + useApiProfile hook
    └── OrdersApiProvider.tsx    # Orders context + useApiOrders hook

lib/constants/
└── routes.ts                 # PUBLIC_ROUTES, PRIVATE_ROUTES, SWR_CONFIG
```

## Usage

### 1. Wrap Page with ApiProvider

```tsx
// app/(public)/products/page.tsx
import { ProductsApiProvider } from "@/lib/client/providers/ProductsApiProvider";

export default function ProductsPage() {
  return (
    <ProductsApiProvider>
      <ProductList />
    </ProductsApiProvider>
  );
}
```

### 2. Use Hook in Child Components

```tsx
// components/ProductList.tsx
import { useApiProducts } from "@/lib/client/providers/ProductsApiProvider";

function ProductList() {
  const { products, isLoading, error, refetch } = useApiProducts();

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return products.map((p) => <ProductCard key={p.id} product={p} />);
}
```

### 3. Single Item ApiProvider

```tsx
// app/(public)/products/[id]/page.tsx
import { ProductApiProvider, useApiProduct } from "@/lib/client/providers/ProductsApiProvider";

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <ProductApiProvider productId={params.id}>
      <ProductDetail />
    </ProductApiProvider>
  );
}

function ProductDetail() {
  const { product, isLoading } = useApiProduct();
  // ...
}
```

### 4. API Client for Mutations

```tsx
import { apiClient } from "@/lib/client/api/axios";

async function createOrder(data: OrderData) {
  return apiClient.post<SuccessRes<Order>>("/orders", data);
}
```

## Available Providers & Hooks

| Provider              | Hook             | Use Case              |
| --------------------- | ---------------- | --------------------- |
| `ProductsApiProvider` | `useApiProducts` | Product list pages    |
| `ProductApiProvider`  | `useApiProduct`  | Single product detail |
| `ProfileApiProvider`  | `useApiProfile`  | User profile pages    |
| `OrdersApiProvider`   | `useApiOrders`   | Order history         |
| `OrderApiProvider`    | `useApiOrder`    | Single order detail   |

## Key Principles

| Principle                        | Implementation                                         |
| -------------------------------- | ------------------------------------------------------ |
| **Page-specific providers**      | Only load data where needed                            |
| **No global state for raw data** | SWR handles caching automatically                      |
| **Derived state in Zustand**     | Filters, search, basket in store                       |
| **Type-safe**                    | Uses `SuccessRes<T>` from `types/api.payload.types.ts` |

## API Keys & Routes

All routes and SWR configuration centralized in `lib/constants/routes.ts`:

```ts
// Public API routes
PUBLIC_ROUTES.PRODUCTS.LIST; // "/products"
PUBLIC_ROUTES.PRODUCTS.DETAIL(id); // "/products/{id}"

// Private API routes
PRIVATE_ROUTES.PROFILE; // "/profile"
PRIVATE_ROUTES.ORDERS.LIST; // "/orders"
PRIVATE_ROUTES.ORDERS.DETAIL(id); // "/orders/{id}"

// SWR configuration
SWR_CONFIG; // Global SWR config
```

## Store Integration (Derived State)

```tsx
// Zustand store for UI state only
const useProductStore = create((set, get) => ({
  searchTerm: "",
  selectedCategory: null,
  basket: [],
  // Selectors accept products as parameter
  getFilteredProducts: (products) => {
    /* filter logic */
  },
  getBasketProducts: (products) => {
    /* filter logic */
  },
}));

// Component combines provider data + store filters
function ProductList() {
  const { products } = useApiProducts();
  const { getFilteredProducts } = useApiProductStore();
  const filtered = getFilteredProducts(products);
}
```

## Direct SWR Usage (Global Components)

For components outside providers (e.g., Header's BasketButton), use SWR directly with route constants. SWR automatically deduplicates requests:

```tsx
import { swrFetcher } from "@/lib/client/api/axios";
import { PUBLIC_ROUTES, SWR_CONFIG } from "@/lib/constants/routes";
import useSWR from "swr";

function BasketButton() {
  const { data } = useSWR(PUBLIC_ROUTES.PRODUCTS.LIST, swrFetcher, SWR_CONFIG);
  const products = data?.data ?? [];
  // ...
}
```
