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
          <div className="h-4 w-16 sm:w-20 bg-slate-200 rounded-full"></div>
        </div>
      ))}
    </>
  );
}

/**
 * Profile Skeleton Loader - Mimics the entire profile page structure
 * Shows loading state for profile header and all info cards
 */
export function ProfileSkeletonLoader() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Profile Header Skeleton */}
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/60 border-l-emerald-200/40">
        {/* Subtle background pattern for depth */}
        <div className="absolute inset-0 bg-radial-[ellipse_at_top_left] from-slate-50/50 via-transparent to-transparent pointer-events-none" />

        {/* Header with elegant gradient mask */}
        <div className="relative bg-linear-to-r from-slate-50 via-slate-100/80 to-slate-50 px-2 sm:px-4 md:px-6 py-5 sm:py-6 md:py-8 border-b border-slate-200/60">
          <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-white to-transparent" />

          <div className="flex gap-4 sm:gap-5 md:gap-6 flex-wrap items-center justify-start max-w-6xl mx-auto px-2 sm:px-3 md:px-6">
            {/* Avatar Skeleton */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-slate-200 animate-pulse border-2 sm:border-4 border-slate-200 shadow-xl" />

            <div className="flex flex-1 items-center justify-between gap-3 sm:gap-4 md:gap-8 min-h-24 md:min-h-32">
              {/* User Info Skeleton */}
              <div className="flex-1 space-y-3">
                <div className="h-8 sm:h-10 md:h-12 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
                <div className="h-4 sm:h-5 bg-slate-200 rounded-md w-1/3 animate-pulse" />
              </div>

              {/* Orders Stats Card Skeleton */}
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/60 shadow-md p-2 sm:p-2.5 md:p-3  min-w-20 md:min-w-24">
                <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <div className="h-4 sm:h-6 md:h-8 w-4 sm:w-6 md:w-8 bg-slate-200 rounded-md animate-pulse" />
                  <div className="h-3 sm:h-4 w-16 sm:w-20 bg-slate-200 rounded-md animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid gap-4 sm:gap-6 md:gap-8">
          {/* Personal Information Card Skeleton */}
          <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-slate-200/60">
            <div className="absolute inset-0 bg-radial-[ellipse_at_top_left] from-slate-50/50 via-transparent to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative bg-linear-to-r from-slate-50 via-slate-100/80 to-slate-50 px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-slate-200/60">
              <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-white to-transparent" />
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-300 rounded-lg sm:rounded-xl animate-pulse" />
                <div className="h-6 sm:h-7 w-32 bg-slate-200 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-4 sm:p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="group">
                    <div className="h-4 w-20 bg-slate-200 rounded-md mb-2 animate-pulse" />
                    <div className="rounded-xl bg-white border border-slate-200/60 p-2.5 sm:p-3">
                      <div className="h-5 sm:h-6 w-full bg-slate-200 rounded-md animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Business Information Card Skeleton */}
          <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-slate-200/60">
            <div className="absolute inset-0 bg-radial-[ellipse_at_top_left] from-slate-50/50 via-transparent to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative bg-linear-to-r from-slate-50 via-slate-100/80 to-slate-50 px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-slate-200/60">
              <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-white to-transparent" />
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-300 rounded-lg sm:rounded-xl animate-pulse" />
                <div className="h-6 sm:h-7 w-32 bg-slate-200 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-4 sm:p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group">
                    <div className="h-4 w-20 bg-slate-200 rounded-md mb-2 animate-pulse" />
                    <div className="rounded-xl bg-white border border-slate-200/60 p-2.5 sm:p-3">
                      <div className="h-5 sm:h-6 w-full bg-slate-200 rounded-md animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Address Information Card Skeleton */}
          <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-slate-200/60">
            <div className="absolute inset-0 bg-radial-[ellipse_at_top_left] from-slate-50/50 via-transparent to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative bg-linear-to-r from-slate-50 via-slate-100/80 to-slate-50 px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-slate-200/60">
              <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-white to-transparent" />
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-300 rounded-lg sm:rounded-xl animate-pulse" />
                <div className="h-6 sm:h-7 w-32 bg-slate-200 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-4 sm:p-5 md:p-6 space-y-4">
              {[1, 2].map((section) => (
                <div key={section}>
                  {/* Address Type Header */}
                  <div className="h-5 w-24 bg-slate-200 rounded-md mb-3 animate-pulse" />

                  {/* Address Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-white border border-slate-200/60 p-3 sm:p-4 space-y-2"
                      >
                        <div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse" />
                        <div className="h-3 w-full bg-slate-200 rounded-md animate-pulse" />
                        <div className="h-3 w-5/6 bg-slate-200 rounded-md animate-pulse" />
                        <div className="h-3 w-4/5 bg-slate-200 rounded-md animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
