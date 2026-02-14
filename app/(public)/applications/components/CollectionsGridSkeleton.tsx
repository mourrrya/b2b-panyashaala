export function CollectionCardSkeleton() {
  return (
    <div className="p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 border-slate-100 bg-white/90 animate-pulse flex flex-col">
      {/* Icon & Title */}
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 sm:h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-3 sm:h-4 bg-emerald-50 rounded w-16" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4 sm:mb-5 flex-1">
        <div className="h-3 sm:h-4 bg-slate-100 rounded w-full" />
        <div className="h-3 sm:h-4 bg-slate-100 rounded w-5/6" />
        <div className="h-3 sm:h-4 bg-slate-100 rounded w-2/3" />
      </div>

      {/* CTA */}
      <div className="pt-3 sm:pt-4 border-t border-slate-100 mt-auto">
        <div className="h-4 bg-emerald-50 rounded w-32" />
      </div>
    </div>
  );
}

export function CollectionsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CollectionCardSkeleton key={i} />
      ))}
    </div>
  );
}
