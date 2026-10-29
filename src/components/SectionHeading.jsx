// Centered section title with optional small label above and text below
export default function SectionHeading({ id, eyebrow, title, children }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <span className="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-semibold uppercase tracking-wider text-plum ring-1 ring-plum/20">
          {eyebrow}
        </span>
      )}
      <h2 id={id} className="mt-3 text-4xl font-semibold text-gray-900 md:text-5xl">
        {title}
      </h2>
      {children && <div className="mt-3 text-gray-600">{children}</div>}
    </div>
  );
}
