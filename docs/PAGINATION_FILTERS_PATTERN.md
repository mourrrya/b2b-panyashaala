# Pagination & Server-Side Filtering Pattern

> Generic template for implementing paginated, filterable data listings with infinite scroll
>
> _Reference: Products listing | Created: Feb 2026_

---

## Quick Start

**What you get:**

- Server-side pagination + filtering
- Infinite scroll (SWR Infinite)
- Debounced search (400ms)
- Skeleton loaders
- Type-safe queries (Zod)

**Stack:** Next.js 15+, Prisma, SWR, Zustand, TypeScript

---

## Architecture

```
UI (Filters + List)
  ↓ debounced filters
Zustand Store (searchTerm, category, etc.)
  ↓ debouncedSearchTerm → Provider
SWR Infinite (page 1, 2, 3...)
  ↓ GET /api/resources?page=N&search=...
API Route (validates params)
  ↓
Service Layer (Prisma: skip/take + where filters)
  ↓
Response: { data: [], pagination: { total, page, totalPages } }
```

---

## Implementation (5 Steps)

### 1. API Layer

**1.1 Schema** (`lib/schema/schema.ts`)

```typescript
export const ResourceFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().optional(),
  category: z.enum(["A", "B"]).optional(),
  ids: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (Array.isArray(val) ? val : val?.split(",").filter(Boolean))),
});

export type ResourceFiltersInput = z.input<typeof ResourceFiltersSchema>;
```

**1.2 Service** (`app/api/services/resourceServices.ts`)

```typescript
export async function getResources(filters: ResourceFiltersInput) {
  const where: Prisma.ModelWhereInput = { isDeleted: false };

  if (filters.ids?.length) where.id = { in: filters.ids };
  if (filters.category) where.category = filters.category;
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 12;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.model.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.model.count({ where }),
  ]);

  return {
    items,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
```

**1.3 Route** (`app/api/resources/route.ts`)

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = validateQueryParams(searchParams, ResourceFiltersSchema).data;
  const result = await getResources(filters);
  return NextResponse.json({ data: result.items, pagination: result.pagination, success: true });
}
```

**1.4 Route Helper** (`lib/constants/routes.ts`)

```typescript
RESOURCES: {
  PAGINATED: (p?: { page?, limit?, search?, category?, ids? }) => {
    if (!p) return "/resources";
    const q = new URLSearchParams();
    if (p.page) q.set("page", String(p.page));
    if (p.limit) q.set("limit", String(p.limit));
    if (p.search) q.set("search", p.search);
    if (p.category) q.set("category", p.category);
    if (p.ids?.length) q.set("ids", p.ids.join(","));
    return `/resources?${q}`;
  },
}
```

---

### 2. Client Data Layer

**2.1 Provider** (`lib/client/providers/ResourceApiProvider.tsx`)

```typescript
export function ResourceApiProvider({ children, search, category }: Props) {
  const limit = PAGINATION_CONFIG.ITEMS_PER_PAGE;

  const getKey: SWRInfiniteKeyLoader = (pageIndex, prevData) => {
    if (prevData && prevData.data.length < limit) return null;
    return PUBLIC_ROUTES.RESOURCES.PAGINATED({
      page: pageIndex + 1, limit, search, category,
    });
  };

  const { data, error, isLoading, size, setSize, mutate } = useSWRInfinite(getKey, swrFetcher, SWR_CONFIG);

  const value = useMemo(() => ({
    items: data?.flatMap(p => p.data) ?? [],
    totalItems: data?.[0]?.pagination?.total ?? 0,
    hasMore: size < (data?.[0]?.pagination?.totalPages ?? 0),
    isLoadingMore: size > 0 && data && !data[size - 1],
    loadNextPage: () => setSize(s => s + 1),
    isLoading, error, refetch: mutate,
  }), [data, isLoading, error, size, setSize, mutate]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
```

**2.2 Store** (`store/resourceStore.ts`)

```typescript
export const useResourceStore = create<Store>()(
  devtools(
    immer((set) => ({
      searchTerm: "",
      debouncedSearchTerm: "",
      selectedCategory: null,
      setSearchTerm: (term) =>
        set((s) => {
          s.searchTerm = term;
        }),
      setDebouncedSearchTerm: (term) =>
        set((s) => {
          s.debouncedSearchTerm = term;
        }),
      setSelectedCategory: (cat) =>
        set((s) => {
          s.selectedCategory = cat;
        }),
    })),
  ),
);
```

**2.3 Hooks** (`hooks/`)

```typescript
// use-infinite-scroll.ts
export function useInfiniteScroll({ hasMore, isLoading, onLoadMore, rootMargin = "200px" }) {
  const sentinelRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry?.isIntersecting && hasMore && !isLoading && onLoadMore(),
      { rootMargin },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);
  return sentinelRef;
}

// use-debounced-callback.ts
export function useDebouncedCallback(callback, delay) {
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (value) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => callback(value), delay);
  };
}
```

---

### 3. UI Layer

**3.1 Filters** (`components/ResourceFilters.tsx`)

```typescript
export function ResourceFilters({ filteredCount, totalCount }) {
  const searchTerm = useSearchTerm();
  const setSearchTerm = useSetSearchTerm();
  const setDebouncedSearchTerm = useSetDebouncedSearchTerm();
  const selectedCategory = useSelectedCategory();
  const setSelectedCategory = useSetSelectedCategory();

  const debouncedSetSearch = useDebouncedCallback(
    (v) => setDebouncedSearchTerm(v),
    400
  );

  return (
    <>
      <input value={searchTerm} onChange={e => { setSearchTerm(e.target.value); debouncedSetSearch(e.target.value); }} />
      <button onClick={() => setSelectedCategory(null)}>All</button>
      {CATEGORIES.map(c => <button key={c.value} onClick={() => setSelectedCategory(c.value)}>{c.label}</button>)}
      <p>Showing {filteredCount} of {totalCount}</p>
    </>
  );
}
```

**3.2 List Client** (`app/resources/ResourcesClient.tsx`)

```typescript
export function ResourcesClient() {
  const debouncedSearch = useDebouncedSearchTerm();
  const category = useSelectedCategory();
  return (
    <ResourceApiProvider search={debouncedSearch} category={category}>
      <ResourcesInner />
    </ResourceApiProvider>
  );
}

function ResourcesInner() {
  const { items, isLoading, isLoadingMore, hasMore, loadNextPage, totalItems } = useApiResources();
  const sentinelRef = useInfiniteScroll({ hasMore, isLoading: isLoadingMore, onLoadMore: loadNextPage });

  if (isLoading) return <GridSkeleton count={6} />;

  return (
    <>
      <Filters filteredCount={items.length} totalCount={totalItems} />
      <div className="grid grid-cols-3 gap-4">
        {items.map(item => <Card key={item.id} item={item} />)}
        {isLoadingMore && <CardSkeleton />}
      </div>
      {hasMore && <div ref={sentinelRef} />}
      {!hasMore && <p>End of results</p>}
    </>
  );
}
```

**3.3 Skeletons** (`components/ResourceCardSkeleton.tsx`)

```typescript
export function CardSkeleton() {
  return <div className="animate-pulse p-4 border rounded-xl">
    <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-slate-100 rounded w-full mb-2" />
    <div className="h-8 bg-emerald-50 rounded" />
  </div>;
}

export function GridSkeleton({ count = 6 }) {
  return <div className="grid grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
  </div>;
}
```

---

### 4. Configuration

**Constants** (`lib/constants/resource.ts`)

```typescript
export const PAGINATION_CONFIG = {
  ITEMS_PER_PAGE: 12,
  SEARCH_DEBOUNCE_MS: 400,
  SCROLL_ROOT_MARGIN: "200px",
};
```

---

### 5. Page Component

```typescript
// app/resources/page.tsx
export default function ResourcesPage() {
  return <ResourcesClient />;
}
```

---

## Testing Checklist

**Functional:**

- [ ] Initial load shows first page
- [ ] Scroll loads next page
- [ ] Search debounces correctly (400ms)
- [ ] Filters reset to page 1
- [ ] Empty/error states display
- [ ] End indicator shows when done

**Performance:**

- [ ] First page < 2s
- [ ] No duplicate API requests
- [ ] Debounce prevents excessive calls

**Edge Cases:**

- [ ] Empty dataset
- [ ] Single item
- [ ] Network errors
- [ ] Invalid query params rejected

---

## Common Issues & Fixes

| Issue                          | Solution                                          |
| ------------------------------ | ------------------------------------------------- |
| Duplicate requests             | Set SWR `dedupingInterval: 2000`                  |
| Filter doesn't reset page      | Ensure getKey returns page 1 URL on filter change |
| Stale data after create/update | Call `refetch()` after mutations                  |
| Search not triggering          | Check `debouncedSearchTerm` in provider deps      |

---

## Migration from Client Filtering

1. Remove Fuse.js from `package.json`
2. Remove `getFilteredItems` from store
3. Update store to only hold filter state
4. Pass filters to provider instead of calling selector
5. Test search behavior differences

---

## Find & Replace Guide

To adapt this pattern:

```bash
YourResource → Order | User | Invoice
YourModel → order | user | invoice
CATEGORY_A → Your actual enum values
ResourceFiltersSchema → OrderFiltersSchema
```

---

**Questions?** Update this doc with your learnings!
