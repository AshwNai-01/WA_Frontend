import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// items: [{ label: "Home", to: "/" }, { label: "Vendors" }]
// An item without `to` is the current page.
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <ChevronRight size={14} />}
          {item.to ? (
            <Link to={item.to} className="hover:text-plum">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900" aria-current="page">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
