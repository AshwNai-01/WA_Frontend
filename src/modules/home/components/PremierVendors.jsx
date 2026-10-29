import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import { getVendors } from "../../vendors/services/vendorApi";
import VendorGrid from "../../vendors/components/VendorGrid";
import FilterSelect from "../../vendors/components/FilterSelect";
import EmptyState from "../../../components/EmptyState";
import { Button } from "../../../components/Button";
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
          <FilterSelect id="premier-city" label="City" value={city} onChange={setCity} options={cities} allLabel="All cities" />
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
          <VendorGrid
            vendors={vendors}
            loading={loading}
            error={error}
            onRetry={refetch}
            columns="lg:grid-cols-4"
            skeletonCount={4}
            empty={
              <EmptyState title="No premier vendors match these filters" text="Try another city or category.">
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              </EmptyState>
            }
          />
        </div>

        {!error && pagination?.total > 0 && (
          <div className="mt-8 flex flex-col items-center gap-2 text-sm text-gray-600">
            <p>
              Showing {vendors.length} of {pagination.total} premier vendors
              {hasFilters ? " for these filters" : ""}
            </p>
            <Link to={vendorsUrl({ city, category })} className="inline-flex items-center gap-1 font-semibold text-plum hover:underline">
              View all vendors <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
