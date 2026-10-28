import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { vendorsUrl } from "../../../utils/constants";
import SectionHeading from "../../common/components/SectionHeading";
import LoadError from "../../common/components/LoadError";

function PlaceCard({ city }) {
  const images = city.images ?? [];

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      {/* overflow-hidden keeps the 16:10 shape even when a photo is portrait */}
      <div className="aspect-[16/10] overflow-hidden bg-brand-light">
        {images.length > 0 && (
          <Swiper
            modules={[A11y, Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={images.length > 1}
            className="place-swiper h-full"
          >
            {images.map((src, i) => (
              <SwiperSlide key={src}>
                <img
                  src={src}
                  alt={`${city.name} wedding destination, photo ${i + 1} of ${images.length}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold uppercase tracking-wider text-gray-900">{city.name}</h3>
        <p className="mt-2 line-clamp-4 flex-1 text-sm text-gray-600">{city.description}</p>
        <Link
          to={vendorsUrl({ city: city.slug })}
          className="mt-4 w-fit rounded-lg bg-brand-light px-4 py-2 text-sm font-semibold text-plum ring-1 ring-plum/20 transition-colors hover:bg-plum hover:text-white"
        >
          View vendors in {city.name}
        </Link>
      </div>
    </article>
  );
}

// "Perfect Places": popular wedding cities, each card with its own photo carousel
export default function PerfectPlaces({ cities }) {
  const popular = (cities.data ?? []).filter((c) => c.isPopular);

  let content;
  if (cities.error) {
    content = <LoadError message={cities.error} onRetry={cities.refetch} />;
  } else if (cities.loading) {
    content = (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-96 animate-pulse rounded-2xl bg-white ring-1 ring-black/5" />
        ))}
      </div>
    );
  } else {
    content = (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {popular.map((c) => (
          <PlaceCard key={c._id} city={c} />
        ))}
      </div>
    );
  }

  return (
    <section className="bg-white/40 py-16 md:py-20" aria-labelledby="perfect-places-heading">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading id="perfect-places-heading" title="Perfect Places">
          Explore the most enchanting locations for your perfect day.
        </SectionHeading>
        <div className="mt-10">{content}</div>
      </div>
    </section>
  );
}
