"use client";

import { PAGINATION_CONFIG } from "@/lib/constants/products";
import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether a page load is in progress */
  isLoading: boolean;
  /** Callback to load the next page */
  onLoadMore: () => void;
  /** Root margin for the intersection observer */
  rootMargin?: string;
  /** Threshold for the intersection observer */
  threshold?: number;
}

/**
 * Hook that returns a ref to attach to a sentinel element.
 * When the sentinel enters the viewport, it triggers `onLoadMore`.
 */
export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = PAGINATION_CONFIG.SCROLL_ROOT_MARGIN,
  threshold = PAGINATION_CONFIG.SCROLL_THRESHOLD,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore],
  );

  useEffect(() => {
    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold,
    });

    observerRef.current.observe(sentinelRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleIntersect, rootMargin, threshold]);

  return sentinelRef;
}
