import { Mail, MapPin, Phone } from "lucide-react";
import usePageTitle from "../../../hooks/usePageTitle";
import { HERO_SLIDES, PHONE_HREF, SITE, unsplash } from "../../../utils/constants";
import ContactForm from "../components/ContactForm";

// /contact: photo and direct contact details on the left, Support form on the right
export default function ContactPage() {
  usePageTitle("Contact Us");
  const photo = HERO_SLIDES[4];

  return (
    <section className="bg-linear-to-br from-[#fbe7dc] via-cream to-[#e3f4ec] py-10 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-plum/30">
          <img src={unsplash(photo.id, 900)} alt={photo.alt} className="h-64 w-full object-cover sm:h-80 lg:h-auto lg:flex-1" />
          <div className="space-y-3 p-6 text-sm text-gray-700">
            <h1 className="text-3xl font-semibold text-gray-900">Contact Us</h1>
            <p className="text-gray-600">Planning a wedding in Rajasthan? Our team usually replies within a day.</p>
            <a href={PHONE_HREF} className="flex items-center gap-2 hover:text-plum">
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

        <ContactForm />
      </div>
    </section>
  );
}
