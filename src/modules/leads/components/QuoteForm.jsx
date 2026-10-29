import { useState } from "react";
import toast from "react-hot-toast";
import { MessageCircle } from "lucide-react";
import { createLead } from "../services/leadApi";
import useForm from "../../../hooks/useForm";
import { todayLocal, validateCommon } from "../../../utils/formValidation";
import { WHATSAPP_URL } from "../../../utils/constants";
import { Button } from "../../../components/Button";
import { SelectField, TextField } from "../../../components/form/FormField";
import ConsentCheckbox from "../../../components/form/ConsentCheckbox";
import HoneypotField from "../../../components/form/HoneypotField";
import SuccessCard from "../../../components/form/SuccessCard";

const EMPTY = { name: "", mobile: "", email: "", category: "", weddingDate: "", consent: false, website: "" };

const validate = (values) => {
  const errors = validateCommon(values);
  if (values.weddingDate && values.weddingDate < todayLocal()) errors.weddingDate = "Choose today or a future date";
  return errors;
};

/**
 * "Get a Quote" form.
 *   city / vendor  -> slugs saved with the lead (where it came from)
 *   categories     -> options for the Vendor Category dropdown
 *   source         -> free text such as "city:jaipur" for the team
 */
export default function QuoteForm({ city, vendor, categories = [], defaultCategory = "", source, title = "Get a Quote" }) {
  const form = useForm({ ...EMPTY, category: defaultCategory }, validate, "quote");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { values, errors, handleChange } = form;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.isValid()) return;

    setSubmitting(true);
    try {
      const res = await createLead({
        name: values.name.trim(),
        mobile: values.mobile.trim(),
        email: values.email.trim(),
        category: values.category || undefined,
        weddingDate: values.weddingDate || undefined,
        consent: values.consent,
        website: values.website,
        city,
        vendor,
        source,
      });
      toast.success(res.message || "Thanks! We'll get back to you shortly.");
      setSent(true);
      form.reset();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <SuccessCard title="Thank you!" text="Your request has been received. Our team will call you back shortly.">
        <Button variant="outline" onClick={() => setSent(false)}>
          Send another request
        </Button>
      </SuccessCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5 sm:p-6">
      <h2 className="text-center text-3xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-center text-sm text-gray-600">Tell us about your celebration and we will get back shortly.</p>

      <HoneypotField id="quote-website" value={values.website} onChange={handleChange("website")} />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <TextField
          id="quote-name"
          label="Your Name"
          autoComplete="name"
          value={values.name}
          onChange={handleChange("name")}
          error={errors.name}
          required
        />
        <TextField
          id="quote-mobile"
          label="Mobile Number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="9876543210 or +14155552671"
          value={values.mobile}
          onChange={handleChange("mobile")}
          error={errors.mobile}
          required
        />
        <TextField
          id="quote-email"
          label="Email ID"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange("email")}
          error={errors.email}
          required
        />
        <SelectField
          id="quote-category"
          label="Vendor Category"
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          value={values.category}
          onChange={handleChange("category")}
          error={errors.category}
        />
        <TextField
          id="quote-weddingDate"
          label="Proposed Wedding Date"
          type="date"
          min={todayLocal()}
          value={values.weddingDate}
          onChange={handleChange("weddingDate")}
          error={errors.weddingDate}
        />
      </div>

      <div className="mt-4">
        <ConsentCheckbox id="quote-consent" checked={values.consent} onChange={handleChange("consent")} error={errors.consent} />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button type="submit" loading={submitting}>
          {submitting ? "Sending…" : "Submit"}
        </Button>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
        >
          <MessageCircle size={16} /> Chat with Us
        </a>
      </div>
    </form>
  );
}
