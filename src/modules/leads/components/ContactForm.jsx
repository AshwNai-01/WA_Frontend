import { useState } from "react";
import toast from "react-hot-toast";
import { createContactMessage } from "../services/leadApi";
import useForm from "../../../hooks/useForm";
import { validateCommon } from "../../../utils/formValidation";
import { Button, ButtonLink } from "../../../components/Button";
import { TextAreaField, TextField } from "../../../components/form/FormField";
import ConsentCheckbox from "../../../components/form/ConsentCheckbox";
import HoneypotField from "../../../components/form/HoneypotField";
import SuccessCard from "../../../components/form/SuccessCard";
import EnquiryTypePicker from "./EnquiryTypePicker";

const NOTE_MAX = 1000;
const EMPTY = { name: "", email: "", mobile: "", enquiryType: "", note: "", consent: false, website: "" };

const validate = (values) => {
  const errors = validateCommon(values);
  if (!values.enquiryType) errors.enquiryType = "Choose who you are";
  if (!values.note.trim()) errors.note = "Tell us how we can help";
  else if (values.note.length > NOTE_MAX) errors.note = `Keep it under ${NOTE_MAX} characters`;
  return errors;
};

// "Support" form on the Contact Us page
export default function ContactForm() {
  const form = useForm(EMPTY, validate, "contact");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { values, errors, handleChange } = form;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.isValid()) return;

    setSubmitting(true);
    try {
      const res = await createContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        mobile: values.mobile.trim(),
        enquiryType: values.enquiryType,
        note: values.note.trim(),
        consent: values.consent,
        website: values.website,
      });
      toast.success(res.message || "Thanks for reaching out!");
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
      <SuccessCard title="Message sent" text="Thanks for reaching out! Our team will contact you soon.">
        <Button variant="outline" onClick={() => setSent(false)}>
          Send another message
        </Button>
        <ButtonLink to="/">Back to home</ButtonLink>
      </SuccessCard>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7"
      aria-labelledby="support-heading"
    >
      <h2 id="support-heading" className="text-center text-4xl font-semibold text-gray-900">
        Support
      </h2>

      <HoneypotField id="contact-website" value={values.website} onChange={handleChange("website")} />

      <div className="mt-6 space-y-4">
        <TextField
          id="contact-name"
          label="Full Name"
          autoComplete="name"
          placeholder="Enter your full name"
          value={values.name}
          onChange={handleChange("name")}
          error={errors.name}
          required
        />
        <TextField
          id="contact-email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange("email")}
          error={errors.email}
          required
        />
        <TextField
          id="contact-mobile"
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

        <EnquiryTypePicker
          id="contact-enquiryType"
          value={values.enquiryType}
          onChange={(type) => form.setValue("enquiryType", type)}
          error={errors.enquiryType}
        />

        <div>
          <TextAreaField
            id="contact-note"
            label="Note"
            rows={5}
            maxLength={NOTE_MAX}
            placeholder="How can we help you?"
            value={values.note}
            onChange={handleChange("note")}
            error={errors.note}
            required
          />
          <p className="mt-1 text-right text-xs text-gray-500">
            {values.note.length}/{NOTE_MAX}
          </p>
        </div>

        <ConsentCheckbox id="contact-consent" checked={values.consent} onChange={handleChange("consent")} error={errors.consent} />
      </div>

      <div className="mt-6 flex justify-center">
        <Button type="submit" variant="gold" loading={submitting} className="min-w-36 px-8 py-3">
          {submitting ? "Sending…" : "Send"}
        </Button>
      </div>
    </form>
  );
}
