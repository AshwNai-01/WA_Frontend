import { Link } from "react-router-dom";
import { errorProps } from "./FormField";

// "I agree to receive quotes..." checkbox shared by the quote and contact forms
export default function ConsentCheckbox({ id, checked, onChange, error }) {
  return (
    <div>
      <label className="flex items-start gap-2 text-xs leading-relaxed text-gray-600">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          {...errorProps(id, error)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-plum"
        />
        <span>
          I agree to receive quotes, updates, and other communications from Cosmical Events via WhatsApp, RCS, SMS, and
          Email. I understand that I can opt out at any time. View our{" "}
          <Link to="/privacy" className="text-plum underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/terms" className="text-plum underline">
            Terms of Use
          </Link>
          .
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
