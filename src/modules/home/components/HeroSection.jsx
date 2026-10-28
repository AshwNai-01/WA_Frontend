import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination } from "swiper/modules";
import { ChevronDown, MapPin, Search } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { HERO_SLIDES, unsplash, vendorsUrl } from "../../../utils/constants";

// No auto-sliding for people who ask their OS to reduce motion
const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function SearchSelect({ id, label, icon: Icon, value, onChange, options, placeholder }) {
  return (
    <div className="relative flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full appearance-none rounded-lg bg-gray-100 pl-10 pr-9 text-sm text-gray-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-plum/40"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o._id} value={o.slug}>
            {o.name}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
    </div>
  );
}

// Category + city search: "Search now" opens /vendors?category=...&city=...
function HeroSearch({ categories, cities }) {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(vendorsUrl({ category, city }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-xl bg-white p-2 shadow-2xl sm:flex-row"
    >
      <SearchSelect
        id="hero-category"
        label="Vendor category"
        icon={Search}
        value={category}
        onChange={setCategory}
        options={categories}
        placeholder="Select category"
      />
      <SearchSelect
        id="hero-city"
        label="Location"
        icon={MapPin}
        value={city}
        onChange={setCity}
        options={cities}
        placeholder="Select location"
      />
      <button
        type="submit"
        className="h-12 rounded-lg bg-plum px-6 text-sm font-semibold text-white transition-colors hover:bg-plum-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
      >
        Search now
      </button>
    </form>
  );
}

export default function HeroSection({ categories = [], cities = [] }) {
  return (
    // Fills the screen below the 4rem (64px) navbar. svh = small viewport height,
    // so mobile browser address bars don't cut off the bottom.
    <section className="relative h-[calc(100svh-4rem)] min-h-[520px] overflow-hidden bg-gray-900" aria-label="Welcome">
      <Swiper
        modules={[A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={1000}
        autoplay={prefersReducedMotion ? false : { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        navigation
        keyboard={{ enabled: true }}
        className="hero-swiper h-full"
      >
        {HERO_SLIDES.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <img
              src={unsplash(slide.id, 1920)}
              srcSet={`${unsplash(slide.id, 800)} 800w, ${unsplash(slide.id, 1280)} 1280w, ${unsplash(slide.id, 1920)} 1920w`}
              sizes="100vw"
              alt={slide.alt}
              // First slide is the page's main image: load it right away
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              className="h-full w-full object-cover"
            />
            {/* Dark overlay keeps the white text readable on every photo.
                It sits inside the slide so it never covers the arrows and dots. */}
            <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/35 to-black/60" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl px-4 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Destination weddings</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            Royal Weddings in Rajasthan
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/90 md:text-lg">
            From Udaipur to Ujjain, we plan it all with verified vendors you can trust.
          </p>
          <HeroSearch categories={categories} cities={cities} />
        </div>
      </div>
    </section>
  );
}
