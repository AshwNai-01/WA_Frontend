import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertCircle, Eye, EyeOff, Heart, Loader2 } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { isValidEmail } from "../../../utils/formValidation";
import FormField, { inputClass } from "../../leads/components/FormField";

// Where to go after login: back to the page that sent you here, else admins -> /admin
const destinationFor = (user, from) => from || (user.role === "admin" ? "/admin" : "/");

export default function LoginPage() {
  const { user, checking, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const previous = document.title;
    document.title = "Login | Cosmical Events";
    return () => {
      document.title = previous;
    };
  }, []);

  // Already logged in: skip the form
  if (!checking && user && !submitting) {
    return <Navigate to={destinationFor(user, from)} replace />;
  }

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(({ [field]: _removed, ...rest }) => rest);
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!form.email.trim()) found.email = "Enter your email";
    else if (!isValidEmail(form.email)) found.email = "Enter a valid email";
    if (!form.password) found.password = "Enter your password";
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`login-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const loggedIn = await login(form.email.trim(), form.password);
      toast.success(`Welcome back, ${loggedIn.name.split(" ")[0]}`);
      navigate(destinationFor(loggedIn, from), { replace: true });
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
            <FormField id="login-email" label="Email" error={errors.email} required>
              <input
                type="email"
                autoComplete="username"
                placeholder="you@example.com"
                value={form.email}
                onChange={update("email")}
                className={inputClass(errors.email)}
              />
            </FormField>

            {/* Not FormField: its child here is a wrapper div, which must not get the input's id */}
            <div>
              <label htmlFor="login-password" className="mb-1 block text-xs font-semibold text-gray-700">
                Password<span className="text-plum"> *</span>
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={update("password")}
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={errors.password ? "login-password-error" : undefined}
                  className={`${inputClass(errors.password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p id="login-password-error" className="mt-1 text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-70"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">Accounts are created by the Cosmical Events team.</p>
      </div>
    </section>
  );
}
