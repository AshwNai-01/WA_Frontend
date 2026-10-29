import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { cityPageUrl, vendorsUrl } from "../../../utils/constants";
import LoadError from "../../../components/LoadError";

// "Plan by city": a chip per city, each opening that city's vendors
export default function PlanByCity({ cities }) {
  return (
    <section className="pb-16 md:pb-20" aria-labelledby="plan-by-city-heading">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-2xl bg-white/80 px-4 py-8 text-center shadow-sm ring-1 ring-black/5 sm:px-8">
          <h2 id="plan-by-city-heading" className="text-3xl font-semibold text-gray-900">
            Plan by city
          </h2>
          <p className="mt-1 text-sm text-gray-600">Meet local event organisers who know the best vendors in each city.</p>

          <div className="mt-6">
            {cities.error ? (
              <LoadError message={cities.error} onRetry={cities.refetch} />
            ) : (
              <ul className="flex flex-wrap justify-center gap-2">
                {cities.loading &&
                  Array.from({ length: 8 }, (_, i) => (
                    <li key={i} className="h-9 w-24 animate-pulse rounded-full bg-gray-100" aria-hidden="true" />
                  ))}
                {(cities.data ?? []).map((c) => (
                  <li key={c._id}>
                    <Link
                      to={cityPageUrl(c.slug)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-plum hover:bg-brand-light hover:text-plum"
                    >
                      <MapPin size={14} /> {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            to={vendorsUrl()}
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >
            View all vendor categories <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
