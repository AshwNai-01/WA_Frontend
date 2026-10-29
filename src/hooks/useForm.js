import { useState } from "react";

/**
 * Form values plus one error message per field.
 *
 *   const form = useForm(EMPTY, validate, "quote");
 *   <TextField id="quote-name" value={form.values.name} onChange={form.handleChange("name")} error={form.errors.name} />
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     if (!form.isValid()) return;
 *     ...send form.values
 *   };
 *
 * validate(values) returns { field: "message" } for every problem.
 * Input ids must be `${idPrefix}-${field}` so the first bad field can get focus.
 */
export default function useForm(initialValues, validate, idPrefix) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const setValue = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    // Editing a field clears its error
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleChange = (field) => (e) => {
    setValue(field, e.target.type === "checkbox" ? e.target.checked : e.target.value);
  };

  // Shows all errors and moves focus to the first one. Returns true when the form is valid.
  const isValid = () => {
    const found = validate(values);
    setErrors(found);
    const firstField = Object.keys(found)[0];
    if (firstField) document.getElementById(`${idPrefix}-${firstField}`)?.focus();
    return !firstField;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, setValue, handleChange, isValid, reset };
}
