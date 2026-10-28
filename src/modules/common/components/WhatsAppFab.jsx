import { MessageCircle } from "lucide-react";
import { SITE } from "../../../utils/constants";

// Floating WhatsApp chat button, bottom-right on every page
export default function WhatsAppFab() {
  const href = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <MessageCircle size={28} strokeWidth={2.2} />
    </a>
  );
}
