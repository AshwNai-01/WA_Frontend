import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginRequest } from "./services/authApi";
import { AUTH_EXPIRED_EVENT, clearToken, getToken, setToken } from "../../services/tokenStorage";

const AuthContext = createContext(null);

// Holds the logged-in user for the whole app: { user, checking, login, logout }.
// On page load a saved token is checked with GET /auth/me, so a refresh keeps you logged in.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true while the saved token is being checked; protected pages wait instead of redirecting
  const [checking, setChecking] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    getMe()
      .then((body) => setUser(body.data))
      // A rejected token is already cleared by apiClient (401). On a network error
      // keep it, so the next visit can still restore the session.
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  // apiClient fires this event when the server rejects our token
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const login = async (email, password) => {
    const body = await loginRequest(email, password);
    setToken(body.token);
    setUser(body.data);
    return body.data;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, checking, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
