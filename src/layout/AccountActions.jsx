import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../modules/auth/AuthContext";
import { Button, ButtonLink } from "../components/Button";

// Login button, or Dashboard + Logout once logged in. `mobile` stacks them full width.
export default function AccountActions({ mobile = false, onNavigate }) {
  const { user, checking, logout } = useAuth();
  const navigate = useNavigate();

  // While a saved session is being checked, show nothing (avoids a "Login" flash)
  if (checking) return mobile ? null : <span className="w-20" aria-hidden="true" />;

  const size = mobile ? "md" : "sm";

  if (!user) {
    return (
      <ButtonLink to="/login" variant="dark" size={size} onClick={onNavigate} className={mobile ? "mt-2" : ""}>
        Login
      </ButtonLink>
    );
  }

  // Leave the page first, then log out, so a protected page never sees "no user"
  // and sends you to /login
  const handleLogout = async () => {
    onNavigate?.();
    await navigate("/");
    logout();
    toast.success("You've been logged out");
  };

  return (
    <div className={mobile ? "mt-2 flex flex-col gap-2" : "flex items-center gap-2"}>
      {user.role === "admin" && (
        <ButtonLink to="/admin" variant="dark" size={size} onClick={onNavigate}>
          <LayoutDashboard size={16} /> Dashboard
        </ButtonLink>
      )}
      <Button variant="light" size={size} onClick={handleLogout}>
        <LogOut size={16} /> Logout
      </Button>
    </div>
  );
}
