// Label + input + error message, wired for screen readers.
// Pass the input as a child; it receives id, aria-invalid and aria-describedby.
import { cloneElement } from "react";

export const inputClass = (hasError) =>
  `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
    hasError ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:border-plum focus:ring-plum/20"
  }`;

export default function FormField({ id, label, error, required, className = "", children }) {
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-gray-700">
        {label}
        {required && <span className="text-plum"> *</span>}
      </label>
      {cloneElement(children, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
