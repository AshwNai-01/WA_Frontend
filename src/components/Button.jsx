import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

// One place for button styles, so every button in the app looks the same.
//   <Button onClick={save}>Save</Button>
//   <Button variant="outline" size="sm">Cancel</Button>
//   <Button type="submit" loading={submitting}>Send</Button>
//   <ButtonLink to="/vendors">Browse vendors</ButtonLink>
const VARIANTS = {
  primary: "bg-plum text-white hover:bg-plum-dark",
  outline: "border border-plum text-plum hover:bg-brand-light",
  dark: "bg-gray-900 text-white hover:bg-gray-700",
  light: "bg-white/60 text-gray-900 hover:bg-white",
  gold: "bg-linear-to-r from-amber-400 to-orange-400 text-gray-900 shadow hover:brightness-105",
};

const SIZES = {
  sm: "px-4 py-1.5",
  md: "px-6 py-2.5",
};

export const buttonClass = (variant = "primary", size = "md", className = "") =>
  `inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-70 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

export function Button({ variant, size, className, loading = false, disabled, type = "button", children, ...props }) {
  return (
    <button type={type} disabled={loading || disabled} className={buttonClass(variant, size, className)} {...props}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, className, to, children, ...props }) {
  return (
    <Link to={to} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
