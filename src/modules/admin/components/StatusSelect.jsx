import { useState } from "react";
import toast from "react-hot-toast";

const COLOURS = {
  new: "bg-blue-50 text-blue-800 ring-blue-200",
  contacted: "bg-amber-50 text-amber-800 ring-amber-200",
  replied: "bg-amber-50 text-amber-800 ring-amber-200",
  closed: "bg-gray-100 text-gray-700 ring-gray-200",
};

// Coloured status dropdown for one row; saves immediately on change
export default function StatusSelect({ id, value, options, onSave, label }) {
  const [saving, setSaving] = useState(false);

  const handleChange = async (e) => {
    const next = e.target.value;
    setSaving(true);
    try {
      await onSave(id, next);
      toast.success(`Marked as ${next}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={saving}
      aria-label={label}
      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 outline-none focus:ring-2 focus:ring-plum/40 disabled:opacity-60 ${
        COLOURS[value] ?? COLOURS.closed
      }`}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
