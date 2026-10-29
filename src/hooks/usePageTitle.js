import { useEffect } from "react";

const DEFAULT_TITLE = "Cosmical Events | Wedding Planners in Rajasthan";

// Sets the browser tab title, e.g. usePageTitle("Contact Us") -> "Contact Us | Cosmical Events".
// Pass nothing (or null while data loads) to keep the default title.
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Cosmical Events` : DEFAULT_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
}
