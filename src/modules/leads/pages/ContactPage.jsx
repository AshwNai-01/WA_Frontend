import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckCircle2, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { createContactMessage } from "../services/leadApi";
import { validateCommon } from "../../../utils/formValidation";
import { HERO_SLIDES, SITE, unsplash } from "../../../utils/constants";
import FormField, { inputClass } from "../components/FormField";

const ENQUIRY_TYPES = [
  { value: "bride", label: "Bride" },
  { value: "groom", label: "Groom" },
  { value: "business", label: "Business" },
  { value: "press", label: "Press" },
];
const NOTE_MAX = 1000;
const EMPTY = { name: "", email: "", mobile: "", enquiryType: "", note: "", consent: false, website: "" };

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const previous = document.title;
    document.title = "Contact Us | Cosmical Events";
    return () => {
      document.title = previous;
    };
  }, []);

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(({ [field]: _removed, ...rest }) => rest);
  };
  const update = (field) => (e) => setField(field, e.target.type === "checkbox" ? e.target.checked : e.target.value);

  const validate = () => {
    const found = validateCommon(form);
    if (!form.enquiryType) found.enquiryType = "Choose who you are";
    if (!form.note.trim()) found.note = "Tell us how we can help";
    else if (form.note.length > NOTE_MAX) found.note = `Keep it under ${NOTE_MAX} characters`;
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(first === "enquiryType" ? "contact-enquiryType-bride" : `contact-${first}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await createContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        enquiryType: form.enquiryType,
        note: form.note.trim(),
        consent: form.consent,
        website: form.website,
      });
      toast.success(res.message || "Thanks for reaching out!");
      setSent(true);
      setForm(EMPTY);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-linear-to-br from-[#fbe7dc] via-cream to-[#e3f4ec] py-10 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2">
        {/* Left: photo and direct contact details */}
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-plum/30">
          <img
            src={unsplash(HERO_SLIDES[4].id, 900)}
            alt={HERO_SLIDES[4].alt}
            className="h-64 w-full object-cover sm:h-80 lg:h-auto lg:flex-1"
          />
          <div className="space-y-3 p-6 text-sm text-gray-700">
            <h1 className="text-3xl font-semibold text-gray-900">Contact Us</h1>
            <p className="text-gray-600">Planning a wedding in Rajasthan? Our team usually replies within a day.</p>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-plum">
              <Phone size={18} className="text-plum" /> {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-plum">
              <Mail size={18} className="text-plum" /> {SITE.email}
            </a>
            <p className="flex items-center gap-2">
              <MapPin size={18} className="text-plum" /> {SITE.address}
            </p>
          </div>
        </div>

        {/* Right: Support form */}
        {sent ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5" role="status">
            <CheckCircle2 size={52} className="text-green-600" />
            <h2 className="mt-3 text-3xl font-semibold text-gray-900">Message sent</h2>
            <p className="mt-2 text-gray-600">Thanks for reaching out! Our team will contact you soon.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setSent(false)}
                className="rounded-full border border-plum px-5 py-2 text-sm font-semibold text-plum hover:bg-brand-light"
              >
                Send another message
              </button>
              <Link to="/" className="rounded-full bg-plum px-5 py-2 text-sm font-semibold text-white hover:bg-plum-dark">
                Back to home
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7"
            aria-labelledby="support-heading"
          >
            <h2 id="support-heading" className="text-center text-4xl font-semibold text-gray-900">
              Support
            </h2>

            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
            </div>

            <div className="mt-6 space-y-4">
              <FormField id="contact-name" label="Full Name" error={errors.name} required>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={update("name")}
                  className={inputClass(errors.name)}
                />
              </FormField>
              <FormField id="contact-email" label="E-mail" error={errors.email} required>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update("email")}
                  className={inputClass(errors.email)}
                />
              </FormField>
              <FormField id="contact-mobile" label="Mobile Number" error={errors.mobile} required>
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

              <fieldset>
                <legend className="mb-1 text-xs font-semibold text-gray-700">
                  I am a<span className="text-plum"> *</span>
                </legend>
                <div
                  className={`grid grid-cols-2 overflow-hidden rounded-lg sm:grid-cols-4 ${
                    errors.enquiryType ? "ring-2 ring-red-300" : ""
                  }`}
                  role="radiogroup"
                  aria-describedby={errors.enquiryType ? "contact-enquiryType-error" : undefined}
                >
                  {ENQUIRY_TYPES.map((t) => (
                    <label key={t.value} className="cursor-pointer">
                      <input
                        id={`contact-enquiryType-${t.value}`}
                        type="radio"
                        name="enquiryType"
                        value={t.value}
                        checked={form.enquiryType === t.value}
                        onChange={() => setField("enquiryType", t.value)}
                        className="peer sr-only"
                      />
                      <span className="block bg-[#7a0a1d] py-2.5 text-center text-sm font-semibold uppercase tracking-wide text-white/80 transition-colors hover:text-white peer-checked:bg-plum peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-4 peer-focus-visible:outline-white">
                        {t.label}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.enquiryType && (
                  <p id="contact-enquiryType-error" className="mt-1 text-xs text-red-600">
                    {errors.enquiryType}
                  </p>
                )}
              </fieldset>

              <FormField id="contact-note" label="Note" error={errors.note} required>
                <textarea
                  rows={5}
                  maxLength={NOTE_MAX}
                  placeholder="How can we help you?"
                  value={form.note}
                  onChange={update("note")}
                  className={`${inputClass(errors.note)} resize-y`}
                />
              </FormField>
              <p className="-mt-3 text-right text-xs text-gray-500">
                {form.note.length}/{NOTE_MAX}
              </p>

              <div>
                <label className="flex items-start gap-2 text-xs leading-relaxed text-gray-600">
                  <input
                    id="contact-consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={update("consent")}
                    aria-invalid={errors.consent ? true : undefined}
                    aria-describedby={errors.consent ? "contact-consent-error" : undefined}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-plum"
                  />
                  <span>
                    I agree to receive quotes, updates, and other communications from Cosmical Events via WhatsApp, RCS,
                    SMS, and Email. I understand that I can opt out at any time. View our{" "}
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
                  <p id="contact-consent-error" className="mt-1 text-xs text-red-600">
                    {errors.consent}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-w-36 items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-400 to-orange-400 px-8 py-3 text-sm font-semibold text-gray-900 shadow transition hover:brightness-105 disabled:opacity-70"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? "Sending…" : "Send"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
