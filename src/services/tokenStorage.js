// The login token lives in localStorage so a page refresh keeps you logged in.
// localStorage can be blocked (private mode, strict settings), so every access is guarded.
const KEY = "token";

export const getToken = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    // Not persisted: the user stays logged in until the tab is refreshed
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear
  }
};

// Fired when the server rejects our token (expired or user removed)
export const AUTH_EXPIRED_EVENT = "auth:expired";
