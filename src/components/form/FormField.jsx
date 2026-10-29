// Labelled form controls with an error message underneath, wired for screen readers.
//   <TextField id="quote-name" label="Your Name" value={...} onChange={...} error={errors.name} required />
//   <SelectField id="quote-category" label="Category" options={[{ value: "dj", label: "DJ" }]} ... />
//   <TextAreaField id="contact-note" label="Note" rows={5} ... />
// Any extra props (type, placeholder, autoComplete...) go straight to the input.

export const inputClass = (hasError) =>
  `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
    hasError ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:border-plum focus:ring-plum/20"
  }`;

// Links an input to its error message
export const errorProps = (id, error) => ({
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${id}-error` : undefined,
});

// Label + any control + error. Use directly for custom controls (e.g. a password with a show button).
export function Field({ id, label, error, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-gray-700">
        {label}
        {required && <span className="text-plum"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({ id, label, error, required, ...inputProps }) {
  return (
    <Field id={id} label={label} error={error} required={required}>
      <input id={id} className={inputClass(error)} {...errorProps(id, error)} {...inputProps} />
    </Field>
  );
}

export function TextAreaField({ id, label, error, required, ...textareaProps }) {
  return (
    <Field id={id} label={label} error={error} required={required}>
      <textarea id={id} className={`${inputClass(error)} resize-y`} {...errorProps(id, error)} {...textareaProps} />
    </Field>
  );
}

export function SelectField({ id, label, error, required, options, placeholder = "Select", ...selectProps }) {
  return (
    <Field id={id} label={label} error={error} required={required}>
      <select id={id} className={inputClass(error)} {...errorProps(id, error)} {...selectProps}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
