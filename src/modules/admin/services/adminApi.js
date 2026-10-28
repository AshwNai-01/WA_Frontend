import apiClient from "../../../services/apiClient";

// All admin-only endpoints; the token is attached by apiClient

export const getLeads = ({ status, page, limit }) =>
  apiClient.get("/leads", { params: { status: status || undefined, page, limit } });

export const updateLeadStatus = (id, status) => apiClient.patch(`/leads/${id}/status`, { status });

export const getMessages = ({ status, page, limit }) =>
  apiClient.get("/contact", { params: { status: status || undefined, page, limit } });

export const updateMessageStatus = (id, status) => apiClient.patch(`/contact/${id}/status`, { status });
