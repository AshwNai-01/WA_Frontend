import { useEffect } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { ChevronRight, Gem, IndianRupee, MapPin, Video } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import { getVendorBySlug, getVendors } from "../services/vendorApi";
import VendorGallery from "../components/VendorGallery";
import VendorCard from "../components/VendorCard";
import QuoteForm from "../../leads/components/QuoteForm";
import LoadError from "../../common/components/LoadError";
import NotFoundPage from "../../common/pages/NotFoundPage";
import formatPrice from "../../../utils/formatPrice";
import { cityPageUrl, vendorsUrl } from "../../../utils/constants";

// Up to 3 other vendors in the same category
function SimilarVendors({ vendor }) {
  const { data } = useFetch(() => getVendors({ category: vendor.category.slug, limit: 4 }), [vendor.slug]);
  const others = (data ?? []).filter((v) => v.slug !== vendor.slug).slice(0, 3);
  if (others.length === 0) return null;

  return (
    <section className="mt-16" aria-labelledby="similar-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 id="similar-heading" className="text-3xl font-semibold text-gray-900">
          More {vendor.category.name}
        </h2>
        <Link to={vendorsUrl({ category: vendor.category.slug })} className="text-sm font-semibold text-plum hover:underline">
          View all
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((v) => (
          <VendorCard key={v._id} vendor={v} />
        ))}
      </div>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl animate-pulse gap-10 px-4 py-10 lg:grid-cols-[1fr_minmax(0,420px)]" aria-hidden="true">
      <div>
        <div className="aspect-[4/3] rounded-2xl bg-gray-200" />
        <div className="mt-6 h-10 w-2/3 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
      </div>
      <div className="h-[480px] rounded-2xl bg-gray-200" />
    </div>
  );
}

// /vendors/:slug
export default function VendorDetailPage() {
  const { slug } = useParams();
  const { categories } = useOutletContext();
  const { data, loading, error, errorStatus, refetch } = useFetch(() => getVendorBySlug(slug), [slug]);
  // useFetch keeps the previous vendor while the next one loads (or fails);
  // only use data that belongs to the slug in the URL
  const vendor = data?.slug === slug ? data : null;

  useEffect(() => {
    if (!vendor) return;
    const previous = document.title;
    document.title = `${vendor.name} | ${vendor.category?.name ?? "Vendor"} in ${vendor.city?.name ?? "Rajasthan"}`;
    return () => {
      document.title = previous;
    };
  }, [vendor]);

  if (errorStatus === 404) return <NotFoundPage />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <LoadError title="Couldn't load this vendor" message={error} onRetry={refetch} />
      </div>
    );
  }
  if (loading || !vendor) return <DetailSkeleton />;

  const price = formatPrice(vendor.startingPrice);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
        <Link to="/" className="hover:text-plum">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link to={vendorsUrl()} className="hover:text-plum">
          Vendors
        </Link>
        {vendor.category && (
          <>
            <ChevronRight size={14} />
            <Link to={vendorsUrl({ category: vendor.category.slug })} className="hover:text-plum">
              {vendor.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-gray-900">{vendor.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_minmax(0,420px)]">
        <div>
          <VendorGallery key={vendor.slug} images={vendor.images} name={vendor.name} />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-semibold text-gray-900 md:text-5xl">{vendor.name}</h1>
            {vendor.isPrime && (
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-900">Prime</span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-700">
            {vendor.category && (
              <Link to={vendorsUrl({ category: vendor.category.slug })} className="flex items-center gap-1.5 hover:text-plum">
                <Gem size={16} className="text-plum" /> {vendor.category.name}
              </Link>
            )}
            {vendor.city && (
              <Link to={cityPageUrl(vendor.city.slug)} className="flex items-center gap-1.5 hover:text-plum">
                <MapPin size={16} className="text-plum" /> {vendor.city.name}
              </Link>
            )}
            {vendor.videoMeeting && (
              <span className="flex items-center gap-1.5">
                <Video size={16} className="text-plum" /> Available for video meetings
              </span>
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-black/5">
            <h2 className="flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-wider text-gray-500">
              <IndianRupee size={16} /> Pricing
            </h2>
            <p className="mt-2 text-2xl font-semibold text-plum">{price ? `Starting from ${price}` : "Price on request"}</p>
            {vendor.priceRanges?.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Packages">
                {vendor.priceRanges.map((range) => (
                  <li key={range} className="rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-plum">
                    ₹{range}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {vendor.description && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-900">About {vendor.name}</h2>
              <p className="mt-2 leading-relaxed text-gray-700">{vendor.description}</p>
            </div>
          )}
        </div>

        {/* Sticks beside the details on large screens */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <QuoteForm
            key={vendor.slug}
            title="Request a Quote"
            vendor={vendor.slug}
            city={vendor.city?.slug}
            defaultCategory={vendor.category?.slug ?? ""}
            categories={categories.data ?? []}
            source={`vendor:${vendor.slug}`}
          />
        </aside>
      </div>

      {vendor.category && <SimilarVendors vendor={vendor} />}
    </div>
  );
}
