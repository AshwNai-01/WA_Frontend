// Company details shown in the navbar, footer and WhatsApp button.
// Placeholder contact values: replace with the real ones before going live.
export const SITE = {
  shortName: "CEP",
  name: "Cosmical Event Planners",
  legalName: "Cosmical Event Planners Pvt. Ltd.",
  tagline: "Building confidence, delivering trust",
  address: "Jaipur, Rajasthan, India",
  phone: "+91 90000 00000",
  email: "hello@example.com",
  // Digits only, with country code, for wa.me links
  whatsappNumber: "919000000000",
  whatsappMessage: "Hi! I'd like help planning a wedding in Rajasthan.",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
};

// Top-level navigation. "Vendors" is a dropdown filled from the API.
export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

// Business figures for the stats section (vendor and city counts come from the API)
export const COMPANY_STATS = {
  yearsExperience: "10+",
  eventsPlanned: "1,500+",
  happyClients: "98%",
};

// Hero slider photos (Unsplash). `unsplash(id, width)` builds a resized URL.
export const unsplash = (id, width) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&q=75&auto=format&fit=crop`;

export const HERO_SLIDES = [
  { id: "1610173827043-9db50e0d8ef9", alt: "Bride in a red lehenga and gold jewellery" },
  { id: "1587271407850-8d438ca9fdf2", alt: "Wedding mandap lit with candles under a chandelier" },
  { id: "1477587458883-47145ed94245", alt: "Hawa Mahal in Jaipur with decorated wedding horses" },
  { id: "1599661046289-e31897846e41", alt: "Amber Fort in Jaipur on a sunny day" },
  { id: "1597157639073-69284dc0fdaf", alt: "Bride and groom's hands with mehandi during the ceremony" },
];

// City page with the Get a Quote form, e.g. /event-planner/jaipur
export const cityPageUrl = (slug) => `/event-planner/${slug}`;

// Turns API slugs into vendor listing URLs, e.g. /vendors?category=caterers
export const vendorsUrl = ({ category, city } = {}) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (city) params.set("city", city);
  const query = params.toString();
  return query ? `/vendors?${query}` : "/vendors";
};
