import apiClient from "../../../services/apiClient";

// GET /vendors?city=jaipur&category=caterers&prime=true&page=1&limit=8
// Empty filters are dropped so the URL stays clean.
export const getVendors = ({ city, category, prime, page, limit } = {}) =>
  apiClient.get("/vendors", {
    params: {
      city: city || undefined,
      category: category || undefined,
      prime: prime || undefined,
      page,
      limit,
    },
  });

export const getVendorBySlug = (slug) => apiClient.get(`/vendors/${slug}`);
