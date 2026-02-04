import { UI_LABELS } from "@/lib/constants";

interface NoResultsProps {
  onClearSearch: () => void;
}

export function NoResults({ onClearSearch }: NoResultsProps) {
  return (
    <div className="text-center py-16">
      <p className="text-lg text-slate-600 mb-4">
        {UI_LABELS.APPLICATIONS.NO_RESULTS}
      </p>
      <button
        onClick={onClearSearch}
        className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
      >
        {UI_LABELS.APPLICATIONS.CLEAR_SEARCH}
      </button>
    </div>
  );
}
