import { Link, useOutletContext, useParams } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import usePageTitle from "../../../hooks/usePageTitle";
import { getVendors } from "../../vendors/services/vendorApi";
import VendorGrid from "../../vendors/components/VendorGrid";
import QuoteForm from "../../leads/components/QuoteForm";
import LoadError from "../../../components/LoadError";
import { ButtonLink } from "../../../components/Button";
import NotFoundPage from "../../../pages/NotFoundPage";
import { PHONE_HREF, vendorsUrl } from "../../../utils/constants";

function CityVendors({ city }) {
  const { data: vendors, pagination, loading, error, refetch } = useFetch(
    () => getVendors({ city: city.slug, limit: 6 }),
    [city.slug]
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="city-vendors-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 id="city-vendors-heading" className="text-3xl font-semibold text-gray-900 md:text-4xl">
          Vendors in {city.name}
        </h2>
        {pagination?.total > 0 && (
          <Link to={vendorsUrl({ city: city.slug })} className="inline-flex items-center gap-1 text-sm font-semibold text-plum hover:underline">
            View all {pagination.total} <ArrowRight size={16} />
          </Link>
        )}
      </div>

      <VendorGrid
        vendors={vendors}
        loading={loading}
        error={error}
        onRetry={refetch}
        skeletonCount={3}
        empty={
          <p className="rounded-2xl bg-white px-4 py-10 text-center text-gray-600 ring-1 ring-black/5">
            We're onboarding vendors in {city.name}. Send us a request above and we'll find the right team for you.
          </p>
        }
      />
    </section>
  );
}

// /event-planner/:slug: "Wedding Planners in Jaipur" with the Get a Quote form
export default function CityPage() {
  const { slug } = useParams();
  const { categories, cities } = useOutletContext();
  const city = cities.data?.find((c) => c.slug === slug);

  usePageTitle(city && `Wedding Planners in ${city.name}`);

  if (cities.error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <LoadError message={cities.error} onRetry={cities.refetch} />
      </div>
    );
  }
  if (cities.loading) {
    return <div className="h-[calc(100svh-4rem)] min-h-[520px] animate-pulse bg-gray-200" aria-hidden="true" />;
  }
  if (!city) return <NotFoundPage />;

  const background = city.images?.[0];

  return (
    <>
      <section className="relative overflow-hidden bg-gray-900">
        {background && <img src={background} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />}
        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/55 to-black/30" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1fr_minmax(0,460px)] lg:py-20">
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">Event organisers in {city.name}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">Wedding Planners in {city.name}</h1>
            <p className="mt-4 max-w-xl text-white/90">{city.description}</p>
            <p className="mt-3 max-w-xl text-white/90">
              <strong>Cosmical Events</strong> plans royal and destination weddings in {city.name} with verified local
              vendors. Plan your special day with our expert team.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to={vendorsUrl({ city: city.slug })}>Explore vendors in {city.name}</ButtonLink>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                <Phone size={16} /> Call Now
              </a>
            </div>
          </div>

          <QuoteForm city={city.slug} categories={categories.data ?? []} source={`city:${city.slug}`} />
        </div>
      </section>

      <CityVendors city={city} />
    </>
  );
}
