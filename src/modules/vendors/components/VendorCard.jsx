import { useState } from "react";
import { Link } from "react-router-dom";
import { Gem, MapPin, Video } from "lucide-react";
import formatPrice from "../../../utils/formatPrice";

// Shown when a vendor has no image or the image fails to load
function ImageFallback({ name }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-light to-[#f3d9e8]">
      <span className="font-heading text-5xl font-bold text-plum/60">{name.charAt(0)}</span>
    </div>
  );
}

export default function VendorCard({ vendor }) {
  const { name, slug, images, isPrime, videoMeeting, startingPrice, category, city } = vendor;
  const [imageFailed, setImageFailed] = useState(false);
  const image = images?.[0];
  const price = formatPrice(startingPrice);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-light">
        {image && !imageFailed ? (
          <img
            src={image}
            alt={`${name}, ${category?.name ?? "wedding vendor"} in ${city?.name ?? "Rajasthan"}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImageFallback name={name} />
        )}

        {isPrime && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-gray-900 shadow">
            Prime
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate text-xl font-semibold text-gray-900" title={name}>
          {name}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase text-gray-700">
          {category && (
            <span className="flex items-center gap-1">
              <Gem size={13} className="text-plum" /> {category.name}
            </span>
          )}
          {city && (
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-plum" /> {city.name}
            </span>
          )}
        </div>

        {videoMeeting && (
          <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">
            <Video size={12} /> Available for video meetings
          </span>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-gray-100 pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              {price ? "Starting from" : "Pricing"}
            </p>
            <p className="font-semibold text-plum">{price ?? "On request"}</p>
          </div>
          <Link
            to={`/vendors/${slug}`}
            aria-label={`View ${name}`}
            className="rounded-full bg-plum px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-plum-dark"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
