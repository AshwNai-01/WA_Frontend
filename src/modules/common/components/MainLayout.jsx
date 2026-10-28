import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import apiClient from "../../../services/apiClient";
import useFetch from "../../../hooks/useFetch";
import useAuth from "../../auth/hooks/useAuth";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppFab from "./WhatsAppFab";

// Shared shell for every page. Categories and cities are fetched once here
// and shared with pages through the Outlet context (useOutletContext()).
export default function MainLayout() {
  const categories = useFetch(() => apiClient.get("/categories"), []);
  const cities = useFetch(() => apiClient.get("/cities"), []);

  // Logout sends you home; once there, clear the flag so /admin goes to /login again
  const { pathname } = useLocation();
  const { loggedOut, acknowledgeLogout } = useAuth();
  useEffect(() => {
    if (loggedOut && pathname === "/") acknowledgeLogout();
  }, [loggedOut, pathname, acknowledgeLogout]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={categories.data ?? []} />

      <main className="flex-1">
        <Outlet context={{ categories, cities }} />
      </main>

      <Footer categories={categories.data ?? []} cities={cities.data ?? []} />
      <WhatsAppFab />
      <ScrollRestoration />
    </div>
  );
}
