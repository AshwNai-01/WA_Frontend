import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getMe, loginRequest } from "../services/authApi";
import { AUTH_EXPIRED_EVENT, clearToken, getToken, setToken } from "../../../services/tokenStorage";

// Holds the logged-in user for the whole app.
// On load, a saved token is checked with GET /auth/me, so a refresh keeps you logged in.
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true after the user clicks Logout, so protected pages send them home, not to /login
  const [loggedOut, setLoggedOut] = useState(false);
  // true while a saved token is being checked; pages wait instead of redirecting to /login
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

  // apiClient fires this when the server rejects our token
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const login = useCallback(async (email, password) => {
    const body = await loginRequest(email, password);
    setToken(body.token);
    setUser(body.data);
    setLoggedOut(false);
    return body.data;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setLoggedOut(true);
  }, []);

  // Called once the post-logout redirect has landed, so later visits to a
  // protected page go to /login as normal
  const acknowledgeLogout = useCallback(() => setLoggedOut(false), []);

  const value = useMemo(
    () => ({ user, checking, loggedOut, login, logout, acknowledgeLogout }),
    [user, checking, loggedOut, login, logout, acknowledgeLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
