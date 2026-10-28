// Same shape as VendorCard, so the grid doesn't jump when data arrives
export default function VendorCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white ring-1 ring-black/5" aria-hidden="true">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded-full bg-gray-100" />
        <div className="flex items-end justify-between border-t border-gray-100 pt-3">
          <div className="h-8 w-20 rounded bg-gray-200" />
          <div className="h-8 w-16 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
