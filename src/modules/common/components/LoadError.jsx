import { RefreshCw } from "lucide-react";

// Inline error box with a retry button, used when a section's data fails to load
export default function LoadError({ title = "Couldn't load this section", message, onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white px-4 py-10 text-center ring-1 ring-black/5">
      <p className="font-medium text-gray-900">{title}</p>
      {message && <p className="mt-1 text-sm text-gray-600">{message}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-plum px-5 py-2 text-sm font-semibold text-white hover:bg-plum-dark"
        >
          <RefreshCw size={16} /> Try again
        </button>
      )}
    </div>
  );
}
