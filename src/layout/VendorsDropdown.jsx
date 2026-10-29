import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { vendorsUrl } from "../utils/constants";

// Desktop "Vendors" menu with every category.
// Opens on hover or click. Closes on mouse leave, Escape, outside click,
// or when keyboard focus leaves it.
export default function VendorsDropdown({ categories }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  // Highlight like an active link while on any /vendors page
  const isActive = useLocation().pathname.startsWith("/vendors");

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
      {/* Click only opens (never toggles): with a mouse, hover has already opened it */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-plum ${
          isActive ? "text-plum" : "text-gray-900"
        }`}
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
