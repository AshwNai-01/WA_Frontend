const ENQUIRY_TYPES = [
  { value: "bride", label: "Bride" },
  { value: "groom", label: "Groom" },
  { value: "business", label: "Business" },
  { value: "press", label: "Press" },
];

// "I am a: Bride / Groom / Business / Press" as a row of radio buttons.
// The first radio gets `id`, so the form can move focus here on an error.
export default function EnquiryTypePicker({ id, value, onChange, error }) {
  return (
    <fieldset>
      <legend className="mb-1 text-xs font-semibold text-gray-700">
        I am a<span className="text-plum"> *</span>
      </legend>

      <div
        role="radiogroup"
        aria-describedby={error ? `${id}-error` : undefined}
        className={`grid grid-cols-2 overflow-hidden rounded-lg sm:grid-cols-4 ${error ? "ring-2 ring-red-300" : ""}`}
      >
        {ENQUIRY_TYPES.map((type, i) => (
          <label key={type.value} className="cursor-pointer">
            <input
              id={i === 0 ? id : undefined}
              type="radio"
              name="enquiryType"
              value={type.value}
              checked={value === type.value}
              onChange={() => onChange(type.value)}
              className="peer sr-only"
            />
            <span className="block bg-[#7a0a1d] py-2.5 text-center text-sm font-semibold uppercase tracking-wide text-white/80 transition-colors hover:text-white peer-checked:bg-plum peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-4 peer-focus-visible:outline-white">
              {type.label}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}
