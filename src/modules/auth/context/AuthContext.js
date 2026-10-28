import { createContext } from "react";

// { user, checking, loggedOut, login(email, password), logout(), acknowledgeLogout() }.
// Provided by AuthProvider.
export const AuthContext = createContext(null);
