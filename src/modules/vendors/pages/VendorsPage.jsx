import { useEffect } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { ChevronRight, SearchX } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import { getVendors } from "../services/vendorApi";
import VendorCard from "../components/VendorCard";
import VendorCardSkeleton from "../components/VendorCardSkeleton";
import FilterSelect from "../components/FilterSelect";
import Pagination from "../../common/components/Pagination";
import LoadError from "../../common/components/LoadError";

const PAGE_SIZE = 9;

// "Photographers in Jaipur", "Caterers in Rajasthan", "Wedding Vendors in Udaipur"...
function pageTitle(categoryName, cityName) {
  if (categoryName && cityName) return `${categoryName} in ${cityName}`;
  if (categoryName) return `${categoryName} in Rajasthan`;
  if (cityName) return `Wedding Vendors in ${cityName}`;
  return "Wedding Vendors";
}

// /vendors?category=caterers&city=jaipur&page=2
// Filters live in the URL, so home page links land on the right results
// and any filtered view can be shared or bookmarked.
export default function VendorsPage() {
  const { categories, cities } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const city = searchParams.get("city") ?? "";
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const { data: vendors, pagination, loading, error, refetch } = useFetch(
    () => getVendors({ category, city, page, limit: PAGE_SIZE }),
    [category, city, page]
  );

  const categoryName = categories.data?.find((c) => c.slug === category)?.name;
  const cityName = cities.data?.find((c) => c.slug === city)?.name;
  const title = pageTitle(categoryName, cityName);

  // Browser tab title; restored when leaving the page
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | Cosmical Events`;
    return () => {
      document.title = previous;
    };
  }, [title]);

  // Changing a filter starts again from page 1; empty values are removed from the URL
  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    if (!("page" in changes)) next.delete("page");
    setSearchParams(next);
  };

  const goToPage = (p) => {
    updateParams({ page: p > 1 ? String(p) : "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = category || city;
  const total = pagination?.total ?? 0;
  // Based on what came back, so a too-high ?page= never shows "73–12 of 12"
  const shown = vendors?.length ?? 0;
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = from + shown - 1;

  let content;
  if (error) {
    content = <LoadError title="Couldn't load vendors" message={error} onRetry={refetch} />;
  } else if (loading && !vendors) {
    content = (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <VendorCardSkeleton key={i} />
        ))}
      </div>
    );
  } else if (vendors.length === 0) {
    content = (
      <div className="flex flex-col items-center rounded-2xl bg-white px-4 py-14 text-center ring-1 ring-black/5">
        <SearchX size={40} className="text-plum/60" />
        <p className="mt-3 text-lg font-medium text-gray-900">
          {page > 1 && total > 0 ? "This page is empty" : "No vendors found"}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {hasFilters ? "Try another city or category." : "Vendors will appear here once they're added."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {page > 1 && total > 0 && (
            <button
              type="button"
              onClick={() => goToPage(1)}
              className="rounded-full bg-plum px-5 py-2 text-sm font-semibold text-white hover:bg-plum-dark"
            >
              Go to first page
            </button>
          )}
          {hasFilters && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="rounded-full border border-plum px-5 py-2 text-sm font-semibold text-plum hover:bg-brand-light"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    );
  } else {
    content = (
      <div
        className={`grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-50" : ""}`}
        aria-busy={loading}
      >
        {vendors.map((v) => (
          <VendorCard key={v._id} vendor={v} />
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="bg-linear-to-br from-brand-light via-cream to-[#e3f4ec] py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-600">
            <Link to="/" className="hover:text-plum">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900">Vendors</span>
          </nav>
          <h1 className="mt-3 text-4xl font-semibold text-gray-900 md:text-5xl">{title}</h1>
          <p className="mt-2 text-gray-600">Verified wedding professionals for destination weddings across Rajasthan.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:flex-row sm:items-end">
          <FilterSelect
            id="vendors-category"
            label="Category"
            value={category}
            onChange={(v) => updateParams({ category: v })}
            options={categories.data ?? []}
            allLabel="All categories"
          />
          <FilterSelect
            id="vendors-city"
            label="City"
            value={city}
            onChange={(v) => updateParams({ city: v })}
            options={cities.data ?? []}
            allLabel="All cities"
          />
          {hasFilters && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="h-[42px] rounded-lg px-4 text-sm font-semibold text-plum hover:bg-brand-light sm:ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>

        <p className="mt-6 text-sm text-gray-600" aria-live="polite">
          {shown > 0 && !error ? `Showing ${from}–${to} of ${total} ${total === 1 ? "vendor" : "vendors"}` : " "}
        </p>

        <div className="mt-3">{content}</div>

        {!error && (
          <div className="mt-10">
            <Pagination page={page} totalPages={pagination?.totalPages} onChange={goToPage} />
          </div>
        )}
      </section>
    </>
  );
}
