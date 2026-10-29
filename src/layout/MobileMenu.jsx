import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { NAV_LINKS, vendorsUrl } from "../utils/constants";
import { navLinkClass } from "./navLinkClass";
import AccountActions from "./AccountActions";

// Slide-down menu below lg, opened by the hamburger button
export default function MobileMenu({ categories, onClose }) {
  const [vendorsOpen, setVendorsOpen] = useState(false);

  return (
    <div className="border-t border-black/10 bg-brand lg:hidden">
      <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3" aria-label="Mobile">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end onClick={onClose} className={(state) => `${navLinkClass(state)} py-3`}>
            {link.label}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={() => setVendorsOpen((open) => !open)}
          aria-expanded={vendorsOpen}
          className="flex items-center justify-between py-3 text-sm font-medium text-gray-900"
        >
          Vendors
          <ChevronDown size={18} className={`transition-transform ${vendorsOpen ? "rotate-180" : ""}`} />
        </button>

        {vendorsOpen && (
          <div className="mb-2 grid grid-cols-2 gap-1 rounded-lg bg-white/80 p-2">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={vendorsUrl({ category: c.slug })}
                onClick={onClose}
                className="rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-plum"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        <AccountActions mobile onNavigate={onClose} />
      </nav>
    </div>
  );
}
