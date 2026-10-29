import { RefreshCw } from "lucide-react";
import { Button } from "./Button";

// Inline error box with a retry button, used when a section's data fails to load
export default function LoadError({ title = "Couldn't load this section", message, onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white px-4 py-10 text-center ring-1 ring-black/5">
      <p className="font-medium text-gray-900">{title}</p>
      {message && <p className="mt-1 text-sm text-gray-600">{message}</p>}
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          <RefreshCw size={16} /> Try again
        </Button>
      )}
    </div>
  );
}
