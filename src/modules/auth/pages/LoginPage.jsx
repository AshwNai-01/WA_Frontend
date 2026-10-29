import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertCircle, Eye, EyeOff, Heart } from "lucide-react";
import { useAuth } from "../AuthContext";
import useForm from "../../../hooks/useForm";
import usePageTitle from "../../../hooks/usePageTitle";
import { isValidEmail } from "../../../utils/formValidation";
import { Button } from "../../../components/Button";
import { Field, TextField, errorProps, inputClass } from "../../../components/form/FormField";

const validate = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = "Enter your email";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email";
  if (!password) errors.password = "Enter your password";
  return errors;
};

export default function LoginPage() {
  usePageTitle("Login");
  const { user, checking, login } = useAuth();
  const location = useLocation();

  const form = useForm({ email: "", password: "" }, validate, "login");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Logged in (already, or just now): go back to the page that sent you here, else admins -> /admin
  if (!checking && user) {
    const destination = location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/");
    return <Navigate to={destination} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!form.isValid()) return;

    setSubmitting(true);
    try {
      const loggedIn = await login(form.values.email.trim(), form.values.password);
      toast.success(`Welcome back, ${loggedIn.name.split(" ")[0]}`);
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100svh-4rem)] items-center bg-linear-to-br from-brand-light via-cream to-[#e3f4ec] px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-plum">
              <Heart size={24} strokeWidth={2.5} />
            </span>
            <h1 className="mt-3 text-4xl font-semibold text-gray-900">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-600">Log in to manage enquiries and vendors.</p>
          </div>

          {serverError && (
            <div role="alert" className="mt-6 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <TextField
              id="login-email"
              label="Email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={form.values.email}
              onChange={form.handleChange("email")}
              error={form.errors.email}
              required
            />

            {/* Password needs a show/hide button inside the box, so it uses Field directly */}
            <Field id="login-password" label="Password" error={form.errors.password} required>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.values.password}
                  onChange={form.handleChange("password")}
                  {...errorProps("login-password", form.errors.password)}
                  className={`${inputClass(form.errors.password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((show) => !show)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            <Button type="submit" variant="dark" loading={submitting} className="w-full py-3">
              {submitting ? "Logging in…" : "Log in"}
            </Button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">Accounts are created by the Cosmical Events team.</p>
      </div>
    </section>
  );
}
