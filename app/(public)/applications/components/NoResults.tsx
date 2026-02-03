interface NoResultsProps {
  onClearSearch: () => void;
}

export function NoResults({ onClearSearch }: NoResultsProps) {
  return (
    <div className="text-center py-16">
      <p className="text-lg text-slate-600 mb-4">
        No applications found matching your search.
      </p>
      <button
        onClick={onClearSearch}
        className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
      >
        Clear search
      </button>
    </div>
  );
}
