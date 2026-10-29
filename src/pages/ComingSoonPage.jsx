import MessagePage from "../components/MessagePage";
import usePageTitle from "../hooks/usePageTitle";

// Placeholder for pages that are planned but not built yet
export default function ComingSoonPage({ title }) {
  usePageTitle(title);
  return <MessagePage title={title} text="This page is coming soon." />;
}
