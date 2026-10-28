import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-plum">404</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Page not found</h1>
      <p className="mt-3 text-gray-600">The page you're looking for doesn't exist or has moved.</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-plum px-6 py-2.5 text-sm font-semibold text-white hover:bg-plum-dark"
      >
        Back to home
      </Link>
    </section>
  );
}
