import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import useAuth from "../hooks/useAuth";

// Wraps routes that need a login (and optionally a role):
//   { element: <ProtectedRoute roles={["admin"]} />, children: [...] }
// Not logged in -> /login, remembering where you were going.
// Just clicked Logout -> home page instead.
export default function ProtectedRoute({ roles }) {
  const { user, checking, loggedOut } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Checking your session">
        <Loader2 size={32} className="animate-spin text-plum" />
      </div>
    );
  }

  if (!user) {
    if (loggedOut) return <Navigate to="/" replace />;
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <ShieldAlert size={44} className="text-plum" />
        <h1 className="mt-3 text-4xl">No access</h1>
        <p className="mt-2 text-gray-600">Your account doesn't have permission to view this page.</p>
        <Link to="/" className="mt-6 rounded-full bg-plum px-6 py-2.5 text-sm font-semibold text-white hover:bg-plum-dark">
          Back to home
        </Link>
      </section>
    );
  }

  return <Outlet />;
}
