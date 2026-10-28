import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { vendorsUrl } from "../../../utils/constants";
import SectionHeading from "../../common/components/SectionHeading";
import LoadError from "../../common/components/LoadError";

// Label colour per card, cycling, like the coloured tags in the original design
const ACCENTS = [
  "bg-plum text-white",
  "bg-violet-600 text-white",
  "bg-amber-500 text-gray-900",
  "bg-teal-600 text-white",
];

function CategoryCard({ category, accent }) {
  return (
    <Link
      to={vendorsUrl({ category: category.slug })}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-light">
        {category.image && (
          <img
            src={category.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className={`absolute bottom-3 left-3 rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${accent}`}>
          {category.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
        <p className="mt-1 flex-1 text-sm text-gray-600">{category.description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-plum">
          Explore {category.name}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

// "Top Wedding Vendors": the featured categories
export default function TopCategories({ categories }) {
  const featured = (categories.data ?? []).filter((c) => c.isFeatured);

  let content;
  if (categories.error) {
    content = <LoadError message={categories.error} onRetry={categories.refetch} />;
  } else if (categories.loading) {
    content = (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-white ring-1 ring-black/5" />
        ))}
      </div>
    );
  } else {
    content = (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((c, i) => (
          <CategoryCard key={c._id} category={c} accent={ACCENTS[i % ACCENTS.length]} />
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20" aria-labelledby="top-categories-heading">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading id="top-categories-heading" eyebrow="Curated for Rajasthan" title="Top Wedding Vendors">
          Verified photographers, venues, caterers and entertainment, handpicked for destination weddings
          across Jaipur, Udaipur and beyond.{" "}
          <Link to={vendorsUrl()} className="font-semibold text-plum underline-offset-2 hover:underline">
            Browse all vendor categories
          </Link>
        </SectionHeading>
        <div className="mt-10">{content}</div>
      </div>
    </section>
  );
}
