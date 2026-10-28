import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../modules/common/components/MainLayout";
import HomePage from "../modules/home/pages/HomePage";
import VendorsPage from "../modules/vendors/pages/VendorsPage";
import CityPage from "../modules/cities/pages/CityPage";
import ContactPage from "../modules/leads/pages/ContactPage";
import ComingSoonPage from "../modules/common/pages/ComingSoonPage";
import NotFoundPage from "../modules/common/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "vendors", element: <VendorsPage /> },
      { path: "event-planner/:slug", element: <CityPage /> },
      { path: "contact", element: <ContactPage /> },
      // Planned pages: placeholders until they are built
      { path: "vendors/:slug", element: <ComingSoonPage title="Vendor Details" /> },
      { path: "about", element: <ComingSoonPage title="About Us" /> },
      { path: "login", element: <ComingSoonPage title="Login" /> },
      { path: "privacy", element: <ComingSoonPage title="Privacy Policy" /> },
      { path: "terms", element: <ComingSoonPage title="Terms of Use" /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
