import axios from "axios";
import { AUTH_EXPIRED_EVENT, clearToken, getToken } from "./tokenStorage";

// One axios instance for the whole app: every API call goes through here
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach the login token (if any) to every request
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Success: return the backend body ({ success, data, ... }) instead of the axios wrapper.
// Failure: always reject with an Error whose message is safe to show in the UI.
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = "Something went wrong. Please try again.";

    if (error.code === "ECONNABORTED") {
      message = "The server is taking too long to respond.";
    } else if (!error.response) {
      message = "Can't reach the server. Check your connection.";
    } else if (error.response.data?.message) {
      message = error.response.data.message;
    }

    // A request that carried a token was rejected as unauthenticated:
    // the token expired or the user was removed. Log out everywhere.
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      clearToken();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }

    const apiError = new Error(message);
    apiError.status = error.response?.status;
    return Promise.reject(apiError);
  }
);

export default apiClient;
