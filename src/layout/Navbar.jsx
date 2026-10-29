import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { SITE } from "../utils/constants";
import VendorsDropdown from "./VendorsDropdown";
import MobileMenu from "./MobileMenu";
import AccountActions from "./AccountActions";
import { navLinkClass } from "./navLinkClass";

function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2" aria-label={`${SITE.name} home`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-plum">
        <Heart size={20} strokeWidth={2.5} />
      </span>
      <span className="font-heading text-2xl font-bold leading-none text-gray-900">{SITE.shortName}</span>
      <span className="hidden border-l border-gray-900/30 pl-2 leading-tight sm:block">
        <span className="block text-[11px] font-semibold uppercase text-gray-900">{SITE.name}</span>
        <span className="block text-[10px] italic text-gray-800">{SITE.tagline}</span>
      </span>
    </Link>
  );
}

export default function Navbar({ categories = [] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-brand shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo onClick={closeMobile} />

        {/* Desktop links (lg and up) */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>
          <VendorsDropdown categories={categories} />
          <NavLink to="/contact" className={navLinkClass}>
            Contact Us
          </NavLink>
          <AccountActions />
        </nav>

        {/* Hamburger (below lg) */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="rounded-md p-2 text-gray-900 hover:bg-white/30 lg:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && <MobileMenu categories={categories} onClose={closeMobile} />}
    </header>
  );
}
