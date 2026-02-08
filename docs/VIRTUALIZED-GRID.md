# VirtualizedGrid Component

A reusable, high-performance virtualized grid component built with `@tanstack/react-virtual`.

## Overview

The `VirtualizedGrid` component provides efficient rendering of large lists in a responsive grid layout. It only renders items visible in the viewport (plus an overscan buffer), dramatically reducing DOM nodes and improving performance for long lists.

## Features

- ✅ **Window-based scrolling** — Works with natural page scrolling (not a scrollable container)
- ✅ **Responsive grid layout** — Automatically adapts to Tailwind breakpoints:
  - Mobile: 1 column
  - Tablet (640px+): 2 columns
  - Desktop (1024px+): 3 columns
- ✅ **Dynamic row height** — Measures actual content height for accurate scrolling
- ✅ **Memory efficient** — Only renders ~7-9 rows (~21-27 items on desktop) regardless of total count
- ✅ **Smooth scrolling** — Configurable overscan buffer prevents blank areas during fast scrolling
- ✅ **TypeScript generic** — Fully typed with any item type

## Usage

```tsx
import { VirtualizedGrid } from "@/components/VirtualizedGrid";

function MyComponent() {
  const items = [...]; // Your data array

  return (
    <VirtualizedGrid
      items={items}
      renderItem={(item) => <YourItemComponent item={item} />}
      keyExtractor={(item) => item.id}
      estimateRowHeight={280}
      overscan={3}
    />
  );
}
```

## Props

### `items: T[]` (required)

The array of items to render.

### `renderItem: (item: T, index: number) => ReactNode` (required)

Render function called for each visible item.

**Parameters:**

- `item` — The item from the array
- `index` — The absolute index in the full items array

**Example:**

```tsx
renderItem={(product, index) => (
  <ProductCard
    product={product}
    index={index}
    onSelect={handleSelect}
  />
)}
```

### `keyExtractor: (item: T, index: number) => string | number` (required)

Function that returns a unique key for each item. Similar to React's `key` prop.

**Example:**

```tsx
keyExtractor={(product) => product.id}
// or with compound keys
keyExtractor={(product) => `${product.category}-${product.id}`}
```

### `estimateRowHeight?: number` (optional, default: `280`)

Initial estimate of a row's height in pixels. Used before the row is measured.

**Tips:**

- Provide a reasonable average height based on your item content
- Too low = more blank space during scroll
- Too high = unnecessary overscan rendering
- The virtualizer will measure actual heights after first render

### `overscan?: number` (optional, default: `3`)

Number of extra rows to render above and below the visible viewport.

**Tips:**

- Higher values = smoother scrolling but more DOM nodes
- Lower values = better memory usage but potential blank areas during fast scroll
- Recommended: `2-5` depending on content complexity

### `className?: string` (optional)

Additional CSS classes for the container element.

## How It Works

### Row-Based Virtualization

Instead of virtualizing individual items, the component virtualizes **rows** of items:

```
Products: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
Columns: 3 (desktop)

Rows:
  Row 0: [1, 2, 3]
  Row 1: [4, 5, 6]
  Row 2: [7, 8, 9]
  Row 3: [10, 11, 12]

Virtual DOM (overscan=1, viewport shows rows 1-2):
  Row 0 (overscan above)
  Row 1 (visible)
  Row 2 (visible)
  Row 3 (overscan below)
```

### Dynamic Measurement

Each row is measured after render using `measureElement`. This provides accurate scrollbar positioning even when items have varying heights.

### Responsive Columns

The component listens to window resize events and recalculates the column count:

- Matches Tailwind breakpoints: `sm` (640px) and `lg` (1024px)
- Automatically re-chunks rows when columns change
- Gaps adapt to match Tailwind utilities: `gap-3` / `sm:gap-4` / `lg:gap-6`

## Performance Benefits

For a list of **1000 items**:

| Scenario           | Without Virtualization | With VirtualizedGrid           |
| ------------------ | ---------------------- | ------------------------------ |
| DOM Nodes          | ~1000 cards            | ~21-27 cards                   |
| Initial Render     | ~1000 components       | ~21-27 components              |
| Scroll Performance | Layout recalc for all  | Layout recalc for visible only |
| Memory Usage       | All items in memory    | Visible items + overscan       |

## Integration Example (Products Page)

```tsx
function ProductsPage() {
  const { products } = useProducts();
  const basket = useBasket();

  return (
    <VirtualizedGrid
      items={products}
      renderItem={(product) => (
        <ProductCard
          product={product}
          basket={basket}
          addToBasket={addToBasket}
          removeFromBasket={removeFromBasket}
        />
      )}
      keyExtractor={(product) => product.id}
      estimateRowHeight={280}
      overscan={3}
    />
  );
}
```

## Exported Utilities

The component also exports helper hooks and functions:

### `useGridColumns()`

React hook that returns the current number of columns (1, 2, or 3) based on window width.

```tsx
const columns = useGridColumns(); // 1, 2, or 3
```

### `getColumns(width: number)`

Pure function that returns column count for a given width.

```tsx
const cols = getColumns(1200); // 3
```

### `getGap(columns: number)`

Returns the gap size in pixels for the given column count.

```tsx
const gap = getGap(3); // 24 (gap-6 = 1.5rem)
```

## Browser Support

Works in all modern browsers with:

- IntersectionObserver API (for infinite scroll integration)
- ResizeObserver API (used internally by @tanstack/react-virtual)

## Dependencies

- `@tanstack/react-virtual` (v3.13+)
- `react` (v18+)

## Notes

- **Window scroll only**: This component uses `useWindowVirtualizer`, not container scrolling. If you need container-based scrolling, use `useVirtualizer` instead.
- **Grid layout**: Currently hardcoded to 1/2/3 column grid. For custom column counts, fork the component or pass additional props.
- **Sticky elements**: If you have sticky headers/filters above the grid, the `scrollMargin` is automatically calculated.

## Troubleshooting

### Items not rendering

- Check that `keyExtractor` returns unique keys
- Verify `items` array is not empty
- Check console for errors in `renderItem`

### Janky scrolling

- Increase `overscan` value (try 5-7)
- Provide more accurate `estimateRowHeight`
- Ensure item components are optimized (avoid inline functions, use React.memo if needed)

### Incorrect scroll position

- The virtualizer measures elements after first render
- Ensure your items render with consistent dimensions
- Check that parent containers don't have conflicting CSS

### Gaps not matching design

- The component uses fixed gap values matching Tailwind defaults
- If using custom Tailwind config, adjust `getGap()` function accordingly

## Future Enhancements

Potential improvements:

- [ ] Configurable column counts via props
- [ ] Container-based scrolling variant
- [ ] Horizontal scrolling support
- [ ] Variable column widths (masonry layout)
- [ ] Scroll restoration on navigation
