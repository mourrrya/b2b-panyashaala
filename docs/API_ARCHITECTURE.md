# API Architecture

A lightweight API layer using **Axios** + **SWR** + **React Context ApiProviders**, with page-specific data fetching.

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Page Components                             │
├─────────────────────────────────────────────────────────────────┤
│    useApiProducts() / useApiProduct() / useApiProfile() / useApiOrders()     │
├─────────────────────────────────────────────────────────────────┤
│  ProductsApiProvider / ProfileApiProvider / OrdersApiProvider (per-page)  │
├─────────────────────────────────────────────────────────────────┤
│                    SWR (caching + revalidation)                  │
├─────────────────────────────────────────────────────────────────┤
│                      Axios Client (api)                          │
├─────────────────────────────────────────────────────────────────┤
│                       /api/* Routes                              │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
lib/client/
├── api/
│   ├── axios.ts        # Axios instance + interceptors + swrFetcher
│   └── swr-config.ts   # SWR config + API key factories
└── providers/
    ├── ProductsApiProvider.tsx  # Products context + useApiProducts hook
    ├── ProfileApiProvider.tsx   # Profile context + useApiProfile hook
    └── OrdersApiProvider.tsx    # Orders context + useApiOrders hook
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
import {
  ProductApiProvider,
  useApiProduct,
} from "@/lib/client/providers/ProductsApiProvider";

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

## Available ApiProviders & Hooks

| ApiProvider           | Hook               | Use Case              |
| --------------------- | ------------------ | --------------------- |
| `ProductsApiProvider` | `useApiProducts()` | Product list pages    |
| `ProductApiProvider`  | `useApiProduct()`  | Single product detail |
| `ProfileApiProvider`  | `useApiProfile()`  | User profile pages    |
| `OrdersApiProvider`   | `useApiOrders()`   | Order history         |
| `OrderApiProvider`    | `useApiOrder()`    | Single order detail   |

## Key Principles

| Principle                        | Implementation                                         |
| -------------------------------- | ------------------------------------------------------ |
| **Page-specific providers**      | Only load data where needed                            |
| **No global state for raw data** | SWR handles caching automatically                      |
| **Derived state in Zustand**     | Filters, search, basket in store                       |
| **Type-safe**                    | Uses `SuccessRes<T>` from `types/api.payload.types.ts` |

## API Keys

```ts
import { apiKeys } from "@/lib/client/api/swr-config";

apiKeys.products.list(); // "/products"
apiKeys.products.detail(id); // "/products/{id}"
apiKeys.profile.me(); // "/profile"
apiKeys.orders.list(); // "/orders"
apiKeys.orders.detail(id); // "/orders/{id}"
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

For components outside providers (e.g., Header's BasketButton), use SWR directly. SWR automatically deduplicates requests:

```tsx
import { swrFetcher } from "@/lib/client/api/axios";
import { apiKeys, swrConfig } from "@/lib/client/api/swr-config";
import useSWR from "swr";

function BasketButton() {
  const { data } = useSWR(apiKeys.products.list(), swrFetcher, swrConfig);
  const products = data?.data ?? [];
  // ...
}
```
