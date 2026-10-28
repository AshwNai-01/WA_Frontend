import { ChevronLeft, ChevronRight } from "lucide-react";

// Page numbers to show: always first, last, current and its neighbours,
// with "…" for the gaps, e.g. 1 … 4 5 6 … 10
function pageList(page, totalPages) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("…");
    result.push(p);
  });
  return result;
}

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const buttonClass =
    "flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors";

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={`${buttonClass} text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronLeft size={18} />
      </button>

      {pageList(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${buttonClass} ${
              p === page ? "bg-plum text-white" : "text-gray-700 ring-1 ring-gray-200 hover:bg-white"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={`${buttonClass} text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
