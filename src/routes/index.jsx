import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../modules/common/components/MainLayout";
import HomePage from "../modules/home/pages/HomePage";
import ComingSoonPage from "../modules/common/pages/ComingSoonPage";
import NotFoundPage from "../modules/common/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      // Planned pages: placeholders until they are built
      { path: "vendors", element: <ComingSoonPage title="Wedding Vendors" /> },
      { path: "vendors/:slug", element: <ComingSoonPage title="Vendor Details" /> },
      { path: "about", element: <ComingSoonPage title="About Us" /> },
      { path: "contact", element: <ComingSoonPage title="Contact Us" /> },
      { path: "login", element: <ComingSoonPage title="Login" /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
