import { useState } from "react";

// Large photo with clickable thumbnails underneath.
// Remount it with key={slug} so a new vendor starts on its first photo.
export default function VendorGallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState({});
  const usable = images.filter((src) => !failed[src]);
  const current = usable[Math.min(active, usable.length - 1)];

  if (usable.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-linear-to-br from-brand-light to-[#f3d9e8]">
        <span className="font-heading text-8xl font-bold text-plum/50">{name.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-brand-light">
        <img
          src={current}
          alt={`${name}, photo ${usable.indexOf(current) + 1} of ${usable.length}`}
          className="h-full w-full object-cover"
          fetchPriority="high"
          onError={() => setFailed((f) => ({ ...f, [current]: true }))}
        />
      </div>

      {usable.length > 1 && (
        <div className="mt-3 flex gap-3" role="group" aria-label="Photos">
          {usable.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={src === current ? "true" : undefined}
              className={`h-20 w-28 overflow-hidden rounded-lg ring-2 transition ${
                src === current ? "ring-plum" : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
                onError={() => setFailed((f) => ({ ...f, [src]: true }))}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
