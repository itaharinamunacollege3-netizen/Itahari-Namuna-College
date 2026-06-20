import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "@/components/cms/Logo";
import { useAuth } from "@/contexts/AuthContext";

const REMEMBER_KEY = "inc_admin_remember_email";

const STATS = [
  { v: "245", l: "Applications" },
  { v: "38", l: "Faculty" },
  { v: "5", l: "Programs" },
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState(
    () => localStorage.getItem(REMEMBER_KEY) || ""
  );
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(
    () => Boolean(localStorage.getItem(REMEMBER_KEY))
  );
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    const redirect = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={redirect} replace />;
  }

  async function submit(e) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);

      if (remember) {
        localStorage.setItem(REMEMBER_KEY, email.trim());
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      toast.success("Welcome back, Administrator");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page min-h-screen overflow-hidden bg-[var(--color-brand-gray)] lg:grid lg:grid-cols-2">
      {/* Visual side */}
      <div className="gradient-hero relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <motion.div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[var(--color-brand-gold)]/30 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <Logo size="md" light compact />

        <div className="relative z-10">
          <h1 className="font-[family-name:var(--font-heading)] text-5xl font-bold leading-tight">
            Manage the college,
            <br />
            beautifully.
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/80">
            A modern command center for admissions, faculty, notices, and
            everything in between.
          </p>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div
                key={s.l}
                className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <div className="font-[family-name:var(--font-heading)] text-2xl font-bold">
                  {s.v}
                </div>
                <div className="text-xs text-white/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} Itahari Namuna College
        </p>
      </div>

      {/* Form side */}
      <div className="flex min-h-screen items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size="md" compact />
          </div>

          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-brand-dark)]">
            Welcome back
          </h2>
          <p className="mt-2 text-slate-500">
            Sign in to access the admin dashboard.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-[var(--color-brand-dark)]">
                Email
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@namunacollege.edu.np"
                  autoComplete="email"
                  required
                  className="login-field h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 outline-none transition focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--color-brand-dark)]">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-[var(--color-brand-primary)] hover:underline"
                  onClick={() =>
                    toast("Contact the system administrator to reset your password.")
                  }
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="login-field h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 outline-none transition focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/20"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--color-brand-dark)]"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-brand-dark)]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="login-checkbox h-4 w-4 rounded border-slate-300"
              />
              Remember me for 30 days
            </label>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="login-submit-btn flex h-12 w-full items-center justify-center gap-2 rounded-xl font-medium text-white transition disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating…
                </>
              ) : (
                "Sign in to dashboard"
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Secure admin portal · Connected to Itahari Namuna College backend
          </p>
        </motion.div>
      </div>
    </div>
  );
}
