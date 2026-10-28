import { ChevronDown } from "lucide-react";

// Labelled dropdown of categories or cities; value is the slug ("" = all)
export default function FilterSelect({ id, label, value, onChange, options, allLabel, className = "w-full sm:w-56" }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:border-plum focus:ring-2 focus:ring-plum/20"
        >
          <option value="">{allLabel}</option>
          {options.map((o) => (
            <option key={o._id} value={o.slug}>
              {o.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>
    </div>
  );
}
