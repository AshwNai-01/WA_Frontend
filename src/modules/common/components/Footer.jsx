import { Link } from "react-router-dom";
import { ArrowRight, Heart, Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS, SITE, cityPageUrl, vendorsUrl } from "../../../utils/constants";

function FooterHeading({ children }) {
  return (
    <h3 className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.2em] text-gray-900">
      {children}
      <span className="mt-2 block h-0.5 w-8 bg-plum" />
    </h3>
  );
}

export default function Footer({ categories = [], cities = [] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand text-gray-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.4fr_1.2fr]">
        {/* Company */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/70 text-plum">
              <Heart size={22} strokeWidth={2.5} />
            </span>
            <div>
              <p className="font-heading text-xl font-bold leading-none">{SITE.shortName}</p>
              <p className="text-[10px] font-semibold uppercase">{SITE.tagline}</p>
            </div>
          </div>
          <p className="mb-3 font-semibold">{SITE.legalName}</p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <MapPin size={18} className="shrink-0" /> {SITE.address}
            </li>
            <li>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="flex gap-2 hover:text-plum">
                <Phone size={18} className="shrink-0" /> {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex gap-2 break-all hover:text-plum">
                <Mail size={18} className="shrink-0" /> {SITE.email}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-2">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-gold px-3 py-1.5 text-xs font-semibold hover:brightness-95"
            >
              Facebook
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-gold px-3 py-1.5 text-xs font-semibold hover:brightness-95"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <FooterHeading>Explore</FooterHeading>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-plum">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to={vendorsUrl()} className="hover:text-plum">
                All Vendors
              </Link>
            </li>
          </ul>
        </div>

        {/* Vendor categories */}
        <div>
          <FooterHeading>Wedding Vendors</FooterHeading>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c._id}>
                <Link to={vendorsUrl({ category: c.slug })} className="hover:text-plum">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link to={vendorsUrl()} className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:text-plum">
            View all categories <ArrowRight size={16} />
          </Link>
        </div>

        {/* Cities */}
        <div>
          <FooterHeading>Event Organisers</FooterHeading>
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <Link
                key={c._id}
                to={cityPageUrl(c.slug)}
                className="rounded-full bg-white/50 px-3 py-1 text-xs font-medium transition-colors hover:bg-white"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-black/10 bg-black/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs sm:flex-row">
          <p>
            © {year} {SITE.legalName} All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-plum">
              Terms of service
            </Link>
            <Link to="/privacy" className="hover:text-plum">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
