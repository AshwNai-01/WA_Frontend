import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, Heart, Menu, X } from "lucide-react";
import { NAV_LINKS, SITE, vendorsUrl } from "../../../utils/constants";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-plum ${isActive ? "text-plum" : "text-gray-900"}`;

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

// Desktop "Vendors" menu: opens on hover, click or Enter.
// Closes on mouse leave, Escape, outside click, or when keyboard focus leaves it.
// Click only opens (never toggles): with a mouse, hover has already opened it.
function VendorsDropdown({ categories }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEscape = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 text-sm font-medium text-gray-900 transition-colors hover:text-plum"
      >
        Vendors
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        // pt-3 keeps the hover area connected between button and panel
        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
          <div className="grid w-[560px] grid-cols-3 gap-x-6 gap-y-1 rounded-xl bg-white p-5 shadow-xl ring-1 ring-black/5">
            {categories.length === 0 && <p className="col-span-3 text-sm text-gray-500">Loading categories…</p>}
            {categories.map((c) => (
              <Link
                key={c._id}
                to={vendorsUrl({ category: c.slug })}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-brand-light hover:text-plum"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Below lg: hamburger button and a slide-down panel
function MobileMenu({ categories, onClose }) {
  const [vendorsOpen, setVendorsOpen] = useState(false);

  return (
    <div className="border-t border-black/10 bg-brand lg:hidden">
      <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3" aria-label="Mobile">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end onClick={onClose} className={(s) => `${linkClass(s)} py-3`}>
            {link.label}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={() => setVendorsOpen((o) => !o)}
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

        <Link
          to="/login"
          onClick={onClose}
          className="mt-2 rounded-full bg-gray-900 px-5 py-2.5 text-center text-sm font-semibold text-white"
        >
          Login
        </Link>
      </nav>
    </div>
  );
}

export default function Navbar({ categories = [] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-brand shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo onClick={closeMobile} />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About Us
          </NavLink>
          <VendorsDropdown categories={categories} />
          <NavLink to="/contact" className={linkClass}>
            Contact Us
          </NavLink>
          <Link
            to="/login"
            className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
          >
            Login
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
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
