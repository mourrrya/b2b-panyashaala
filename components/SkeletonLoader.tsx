"use client";

interface SkeletonLoaderProps {
  count?: number;
  className?: string;
  itemClassName?: string;
  lineClassName?: string;
}

export function CategorySkeletonLoader({
  count = 5,
  className = "",
  itemClassName = "",
}: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className={`flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100 animate-pulse ${itemClassName}`}
        >
          <div className="h-4 w-16 sm:w-20 bg-slate-200 rounded"></div>
        </div>
      ))}
    </>
  );
}
