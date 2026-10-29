import { ButtonLink } from "./Button";

// Centered full-page message with a "Back to home" button (404, coming soon, no access)
export default function MessagePage({ icon: Icon, eyebrow, title, text }) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      {Icon && <Icon size={44} className="text-plum" />}
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-plum">{eyebrow}</p>}
      <h1 className="mt-2 text-4xl md:text-5xl">{title}</h1>
      <p className="mt-3 text-gray-600">{text}</p>
      <ButtonLink to="/" className="mt-6">
        Back to home
      </ButtonLink>
    </section>
  );
}
