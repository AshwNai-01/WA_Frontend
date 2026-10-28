import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw, SearchX } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import { getVendors } from "../../vendors/services/vendorApi";
import VendorCard from "../../vendors/components/VendorCard";
import VendorCardSkeleton from "../../vendors/components/VendorCardSkeleton";
import FilterSelect from "../../vendors/components/FilterSelect";
import { vendorsUrl } from "../../../utils/constants";

const LIMIT = 8;

// "Premier Professionals": prime vendors, filterable by city and category
export default function PremierVendors({ categories = [], cities = [] }) {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const { data: vendors, pagination, loading, error, refetch } = useFetch(
    () => getVendors({ city, category, prime: true, limit: LIMIT }),
    [city, category]
  );

  const hasFilters = city || category;
  const clearFilters = () => {
    setCity("");
    setCategory("");
  };

  let content;
  if (error) {
    content = (
      <div className="flex flex-col items-center rounded-2xl bg-white px-4 py-12 text-center ring-1 ring-black/5">
        <p className="font-medium text-gray-900">Couldn't load vendors</p>
        <p className="mt-1 text-sm text-gray-600">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-plum px-5 py-2 text-sm font-semibold text-white hover:bg-plum-dark"
        >
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    );
  } else if (loading && !vendors) {
    // First load: skeletons. Later filter changes keep the old cards (dimmed) instead.
    content = (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <VendorCardSkeleton key={i} />
        ))}
      </div>
    );
  } else if (vendors.length === 0) {
    content = (
      <div className="flex flex-col items-center rounded-2xl bg-white px-4 py-12 text-center ring-1 ring-black/5">
        <SearchX size={36} className="text-plum/60" />
        <p className="mt-3 font-medium text-gray-900">No premier vendors match these filters</p>
        <p className="mt-1 text-sm text-gray-600">Try another city or category.</p>
        <button
          type="button"
          onClick={clearFilters}
          className="mt-4 rounded-full border border-plum px-5 py-2 text-sm font-semibold text-plum hover:bg-brand-light"
        >
          Clear filters
        </button>
      </div>
    );
  } else {
    content = (
      <div
        className={`grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-4 ${loading ? "opacity-50" : ""}`}
        aria-busy={loading}
      >
        {vendors.map((v) => (
          <VendorCard key={v._id} vendor={v} />
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20" aria-labelledby="premier-heading">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 id="premier-heading" className="text-4xl font-semibold text-gray-900 md:text-5xl">
            Premier Professionals
          </h2>
          <p className="mt-3 text-gray-600">Meet the top-tier vendors ready to make your wedding magical.</p>
        </div>

        <div className="mx-auto mt-8 flex max-w-lg flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:justify-center">
          <FilterSelect
            id="premier-city"
            label="City"
            value={city}
            onChange={setCity}
            options={cities}
            allLabel="All cities"
          />
          <FilterSelect
            id="premier-category"
            label="Category"
            value={category}
            onChange={setCategory}
            options={categories}
            allLabel="All categories"
          />
        </div>

        <div className="mt-10" aria-live="polite">
          {content}
        </div>

        {!error && pagination?.total > 0 && (
          <div className="mt-8 flex flex-col items-center gap-2 text-sm text-gray-600">
            <p>
              Showing {vendors.length} of {pagination.total} premier vendors
              {hasFilters ? " for these filters" : ""}
            </p>
            <Link
              to={vendorsUrl({ city, category })}
              className="inline-flex items-center gap-1 font-semibold text-plum hover:underline"
            >
              View all vendors <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
