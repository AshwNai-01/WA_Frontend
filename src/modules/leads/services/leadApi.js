import apiClient from "../../../services/apiClient";

// POST /leads: "Get a Quote" form. category/city/vendor are slugs.
export const createLead = (lead) => apiClient.post("/leads", lead);

// POST /contact: "Contact Us" form
export const createContactMessage = (message) => apiClient.post("/contact", message);
