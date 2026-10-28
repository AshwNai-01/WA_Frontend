import { Link } from "react-router-dom";

// Placeholder for pages that are planned but not built yet
export default function ComingSoonPage({ title }) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-4xl md:text-5xl">{title}</h1>
      <p className="mt-3 text-gray-600">This page is coming soon.</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-plum px-6 py-2.5 text-sm font-semibold text-white hover:bg-plum-dark"
      >
        Back to home
      </Link>
    </section>
  );
}
