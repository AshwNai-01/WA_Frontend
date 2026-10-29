import VendorCard from "./VendorCard";
import VendorCardSkeleton from "./VendorCardSkeleton";
import LoadError from "../../../components/LoadError";

/**
 * Grid of vendor cards that also handles loading, error and empty states.
 *
 *   <VendorGrid vendors={data} loading={loading} error={error} onRetry={refetch}
 *               columns="lg:grid-cols-4" empty={<EmptyState title="No vendors" />} />
 *
 * First load shows skeleton cards. Later loads (new filters) keep the old cards
 * on screen, dimmed, so the page doesn't jump.
 */
export default function VendorGrid({
  vendors,
  loading = false,
  error,
  onRetry,
  columns = "lg:grid-cols-3",
  skeletonCount = 6,
  empty = null,
}) {
  const gridClass = `grid gap-5 sm:grid-cols-2 ${columns}`;

  if (error) {
    return <LoadError title="Couldn't load vendors" message={error} onRetry={onRetry} />;
  }

  if (loading && !vendors) {
    return (
      <div className={gridClass}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <VendorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!vendors || vendors.length === 0) return empty;

  return (
    <div className={`${gridClass} transition-opacity ${loading ? "opacity-50" : ""}`} aria-busy={loading}>
      {vendors.map((v) => (
        <VendorCard key={v._id} vendor={v} />
      ))}
    </div>
  );
}
