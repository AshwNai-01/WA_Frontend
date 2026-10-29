import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "../AuthContext";
import MessagePage from "../../../components/MessagePage";

// Wraps routes that need a login (and optionally a role):
//   { element: <ProtectedRoute roles={["admin"]} />, children: [...] }
// Not logged in -> /login, remembering the page you wanted.
export default function ProtectedRoute({ roles }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Checking your session">
        <Loader2 size={32} className="animate-spin text-plum" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  if (roles && !roles.includes(user.role)) {
    return (
      <MessagePage icon={ShieldAlert} title="No access" text="Your account doesn't have permission to view this page." />
    );
  }

  return <Outlet />;
}
