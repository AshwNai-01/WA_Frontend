import { useOutletContext, useSearchParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import usePageTitle from "../../../hooks/usePageTitle";
import { getVendors } from "../services/vendorApi";
import VendorGrid from "../components/VendorGrid";
import FilterSelect from "../components/FilterSelect";
import Breadcrumb from "../../../components/Breadcrumb";
import EmptyState from "../../../components/EmptyState";
import Pagination from "../../../components/Pagination";
import { Button } from "../../../components/Button";

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
  usePageTitle(title);

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

  const clearFilters = () => setSearchParams({});

  const hasFilters = category || city;
  const total = pagination?.total ?? 0;
  // Based on what came back, so a too-high ?page= never shows "73–12 of 12"
  const shown = vendors?.length ?? 0;
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = from + shown - 1;
  const pastLastPage = page > 1 && total > 0;

  const emptyState = (
    <EmptyState
      title={pastLastPage ? "This page is empty" : "No vendors found"}
      text={hasFilters ? "Try another city or category." : "Vendors will appear here once they're added."}
    >
      {pastLastPage && <Button onClick={() => goToPage(1)}>Go to first page</Button>}
      {hasFilters && (
        <Button variant="outline" onClick={clearFilters}>
          Clear filters
        </Button>
      )}
    </EmptyState>
  );

  return (
    <>
      <section className="bg-linear-to-br from-brand-light via-cream to-[#e3f4ec] py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Vendors" }]} />
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
              onClick={clearFilters}
              className="h-[42px] rounded-lg px-4 text-sm font-semibold text-plum hover:bg-brand-light sm:ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>

        <p className="mt-6 text-sm text-gray-600" aria-live="polite">
          {shown > 0 && !error ? `Showing ${from}–${to} of ${total} ${total === 1 ? "vendor" : "vendors"}` : " "}
        </p>

        <div className="mt-3">
          <VendorGrid vendors={vendors} loading={loading} error={error} onRetry={refetch} empty={emptyState} />
        </div>

        {!error && (
          <div className="mt-10">
            <Pagination page={page} totalPages={pagination?.totalPages} onChange={goToPage} />
          </div>
        )}
      </section>
    </>
  );
}
