"use client";

import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

// =============================================================================
// GRID COLUMN HELPERS
// =============================================================================

/** Tailwind breakpoints in px */
const SM_BREAKPOINT = 640;
const LG_BREAKPOINT = 1024;

/** Return columns matching the Tailwind grid-cols-1 / sm:2 / lg:3 breakpoints */
function getColumns(width: number): number {
  if (width >= LG_BREAKPOINT) return 3;
  if (width >= SM_BREAKPOINT) return 2;
  return 1;
}

/** Hook that tracks the current column count based on window width */
function useGridColumns() {
  const [columns, setColumns] = useState(() =>
    typeof window !== "undefined" ? getColumns(window.innerWidth) : 3,
  );

  useEffect(() => {
    const onResize = () => setColumns(getColumns(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return columns;
}

/** Gap values matching Tailwind gap-3 / sm:gap-4 / lg:gap-6 */
function getGap(columns: number): number {
  if (columns >= 3) return 24; // gap-6 = 1.5rem
  if (columns >= 2) return 16; // gap-4 = 1rem
  return 12; // gap-3 = 0.75rem
}

// =============================================================================
// VIRTUALIZED GRID COMPONENT
// =============================================================================

export interface VirtualizedGridProps<T> {
  /** Array of items to render */
  items: T[];
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode;
  /** Unique key extractor for each item */
  keyExtractor: (item: T, index: number) => string | number;
  /** Estimated height of a row in pixels (used before measurement) */
  estimateRowHeight?: number;
  /** Number of extra rows to render above/below viewport */
  overscan?: number;
  /** Additional className for the container */
  className?: string;
}

export function VirtualizedGrid<T>({
  items,
  renderItem,
  keyExtractor,
  estimateRowHeight = 280,
  overscan = 3,
  className = "",
}: VirtualizedGridProps<T>) {
  const columns = useGridColumns();
  const gap = getGap(columns);

  // ---------------------------------------------------------------------------
  // Build row model: chunk items into rows of `columns` items
  // ---------------------------------------------------------------------------
  const rowCount = Math.ceil(items.length / columns);

  // Ref used by the window virtualizer to compute scroll offset
  const listRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Window virtualizer – virtualizes rows, not individual items.
  // Uses measureElement for accurate, content-driven row heights.
  // ---------------------------------------------------------------------------
  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => estimateRowHeight,
    overscan,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    gap,
  });

  // Keep scrollMargin in sync after layout shifts (filter collapse, etc.)
  useEffect(() => {
    if (listRef.current) {
      virtualizer.scrollRect; // trigger recalc
    }
  });

  const virtualRows = virtualizer.getVirtualItems();

  // ---------------------------------------------------------------------------
  // Measure callback for dynamic row heights
  // ---------------------------------------------------------------------------
  const measureRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        const index = Number(node.dataset.index);
        if (!Number.isNaN(index)) {
          virtualizer.measureElement(node);
        }
      }
    },
    [virtualizer],
  );

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div ref={listRef} className={className}>
      <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
        {virtualRows.map((virtualRow) => {
          const startIdx = virtualRow.index * columns;
          const rowItems = items.slice(startIdx, startIdx + columns);

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={measureRef}
              className="absolute left-0 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
              style={{
                top: 0,
                transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              {rowItems.map((item, idx) => {
                const absoluteIndex = startIdx + idx;
                return (
                  <div key={keyExtractor(item, absoluteIndex)}>
                    {renderItem(item, absoluteIndex)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Export hooks for external use if needed
export { getColumns, getGap, useGridColumns };
