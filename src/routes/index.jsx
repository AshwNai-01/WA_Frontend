import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../modules/common/components/MainLayout";
import HomePage from "../modules/home/pages/HomePage";
import VendorsPage from "../modules/vendors/pages/VendorsPage";
import VendorDetailPage from "../modules/vendors/pages/VendorDetailPage";
import CityPage from "../modules/cities/pages/CityPage";
import ContactPage from "../modules/leads/pages/ContactPage";
import LoginPage from "../modules/auth/pages/LoginPage";
import ProtectedRoute from "../modules/auth/components/ProtectedRoute";
import AdminDashboard from "../modules/admin/pages/AdminDashboard";
import ComingSoonPage from "../modules/common/pages/ComingSoonPage";
import NotFoundPage from "../modules/common/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "vendors", element: <VendorsPage /> },
      { path: "vendors/:slug", element: <VendorDetailPage /> },
      { path: "event-planner/:slug", element: <CityPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "login", element: <LoginPage /> },
      // Admin only: ProtectedRoute redirects to /login or shows "No access"
      {
        element: <ProtectedRoute roles={["admin"]} />,
        children: [{ path: "admin", element: <AdminDashboard /> }],
      },
      // Planned pages: placeholders until they are built
      { path: "about", element: <ComingSoonPage title="About Us" /> },
      { path: "privacy", element: <ComingSoonPage title="Privacy Policy" /> },
      { path: "terms", element: <ComingSoonPage title="Terms of Use" /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
