import { Outlet, ScrollRestoration } from "react-router-dom";
import apiClient from "../services/apiClient";
import useFetch from "../hooks/useFetch";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppFab from "./WhatsAppFab";

// Shared shell for every page. Categories and cities are fetched once here
// and shared with pages through the Outlet context (useOutletContext()).
export default function MainLayout() {
  const categories = useFetch(() => apiClient.get("/categories"), []);
  const cities = useFetch(() => apiClient.get("/cities"), []);

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
