import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { createLead } from "../services/leadApi";
import { todayLocal, validateCommon } from "../../../utils/formValidation";
import { SITE } from "../../../utils/constants";
import FormField, { inputClass } from "./FormField";

const EMPTY = { name: "", mobile: "", email: "", category: "", weddingDate: "", consent: false, website: "" };

/**
 * "Get a Quote" form.
 *   city / vendor  -> slugs saved with the lead (where it came from)
 *   categories     -> options for the Vendor Category dropdown
 *   source         -> free text such as "city:jaipur" for the team
 */
export default function QuoteForm({ city, vendor, categories = [], defaultCategory = "", source, title = "Get a Quote" }) {
  const [form, setForm] = useState({ ...EMPTY, category: defaultCategory });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    // Clear a field's error as soon as it's edited
    if (errors[field]) setErrors(({ [field]: _removed, ...rest }) => rest);
  };

  const validate = () => {
    const found = validateCommon(form);
    if (form.weddingDate && form.weddingDate < todayLocal()) found.weddingDate = "Choose today or a future date";
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move focus to the first problem so keyboard and screen-reader users land on it
      document.getElementById(`quote-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await createLead({
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        category: form.category || undefined,
        weddingDate: form.weddingDate || undefined,
        consent: form.consent,
        website: form.website,
        city,
        vendor,
        source,
      });
      toast.success(res.message || "Thanks! We'll get back to you shortly.");
      setSent(true);
      setForm({ ...EMPTY, category: defaultCategory });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappHref = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

  if (sent) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-xl ring-1 ring-black/5 sm:p-8" role="status">
        <CheckCircle2 size={48} className="mx-auto text-green-600" />
        <h2 className="mt-3 text-3xl font-semibold text-gray-900">Thank you!</h2>
        <p className="mt-2 text-gray-600">Your request has been received. Our team will call you back shortly.</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 rounded-full border border-plum px-5 py-2 text-sm font-semibold text-plum hover:bg-brand-light"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5 sm:p-6">
      <h2 className="text-center text-3xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-center text-sm text-gray-600">Tell us about your celebration and we will get back shortly.</p>

      {/* Spam trap: hidden from people, bots fill it in (see backend middlewares/honeypot.js) */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="quote-website">Website</label>
        <input id="quote-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <FormField id="quote-name" label="Your Name" error={errors.name} required>
          <input type="text" autoComplete="name" value={form.name} onChange={update("name")} className={inputClass(errors.name)} />
        </FormField>
        <FormField id="quote-mobile" label="Mobile Number" error={errors.mobile} required>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="9876543210 or +14155552671"
            value={form.mobile}
            onChange={update("mobile")}
            className={inputClass(errors.mobile)}
          />
        </FormField>
        <FormField id="quote-email" label="Email ID" error={errors.email} required>
          <input type="email" autoComplete="email" value={form.email} onChange={update("email")} className={inputClass(errors.email)} />
        </FormField>
        <FormField id="quote-category" label="Vendor Category" error={errors.category}>
          <select value={form.category} onChange={update("category")} className={inputClass(errors.category)}>
            <option value="">Select</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="quote-weddingDate" label="Proposed Wedding Date" error={errors.weddingDate}>
          <input
            type="date"
            min={todayLocal()}
            value={form.weddingDate}
            onChange={update("weddingDate")}
            className={inputClass(errors.weddingDate)}
          />
        </FormField>
      </div>

      <div className="mt-4">
        <label className="flex items-start gap-2 text-xs leading-relaxed text-gray-600">
          <input
            id="quote-consent"
            type="checkbox"
            checked={form.consent}
            onChange={update("consent")}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "quote-consent-error" : undefined}
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
        {errors.consent && (
          <p id="quote-consent-error" className="mt-1 text-xs text-red-600">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-plum px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-plum-dark disabled:opacity-70"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Sending…" : "Submit"}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
        >
          <MessageCircle size={16} /> Chat with Us
        </a>
      </div>
    </form>
  );
}
