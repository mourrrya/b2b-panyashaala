import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  error: string | null;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 md:gap-3">
      <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500 shrink-0 mt-0.5" />
      <p className="text-xs md:text-sm text-red-700">{error}</p>
    </div>
  );
}
