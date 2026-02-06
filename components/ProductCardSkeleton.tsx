export function ProductCardSkeleton() {
  return (
    <div className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-slate-100 bg-white flex flex-col animate-pulse">
      {/* Header: title + category badge */}
      <div className="flex items-start justify-between gap-1 mb-2 sm:mb-3">
        <div className="flex-1 space-y-2">
          <div className="h-5 sm:h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-4 sm:h-5 bg-slate-200 rounded w-1/2" />
        </div>
        <div className="h-5 sm:h-6 bg-emerald-100 rounded-full w-20 sm:w-24 shrink-0" />
      </div>

      {/* Description lines */}
      <div className="space-y-2 mb-3 sm:mb-4">
        <div className="h-3 sm:h-4 bg-slate-100 rounded w-full" />
        <div className="h-3 sm:h-4 bg-slate-100 rounded w-full" />
        <div className="h-3 sm:h-4 bg-slate-100 rounded w-2/3" />
      </div>

      {/* INCI + Applications section */}
      <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-slate-100 mb-2">
        <div className="flex gap-2">
          <div className="h-3 bg-slate-200 rounded w-10" />
          <div className="h-3 bg-slate-100 rounded w-3/5" />
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-slate-100 rounded w-20" />
          <div className="h-3 bg-emerald-50 rounded w-4/5" />
        </div>
      </div>

      {/* Button */}
      <div className="mt-auto w-full h-8 sm:h-9 bg-emerald-50 rounded-lg" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
