import apiClient from "../../../services/apiClient";

export const loginRequest = (email, password) => apiClient.post("/auth/login", { email, password });

export const getMe = () => apiClient.get("/auth/me");
