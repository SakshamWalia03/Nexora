import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

// ── Shared background shell ──────────────────────────────────────────────
const Shell = ({ children }) => (
  <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }}
    />
    <div className="absolute top-[-120px] right-[-80px] w-[420px] h-[420px] rounded-full bg-violet-600 opacity-[0.12] blur-[100px] pointer-events-none" />
    <div className="absolute bottom-[-80px] left-[-60px] w-[320px] h-[320px] rounded-full bg-cyan-500 opacity-[0.10] blur-[90px] pointer-events-none" />
    <div className="relative z-10 w-full max-w-md">{children}</div>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>
  </div>
);

// ── Logo mark ────────────────────────────────────────────────────────────
const Logo = () => (
  <div className="flex items-center gap-3 mb-10">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1b0f3a" />
          <stop offset="1" stopColor="#0b1e35" />
        </linearGradient>
        <linearGradient id="nGrad2" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="0.5" stopColor="#818cf8" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="rimGrad2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0891b2" stopOpacity="0.5" />
        </linearGradient>
        <filter id="softGlow2" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0.6" y="0.6" width="38.8" height="38.8" rx="11" fill="url(#bgGrad2)" />
      <rect x="0.6" y="0.6" width="38.8" height="38.8" rx="11" fill="none" stroke="url(#rimGrad2)" strokeWidth="1.2" />
      <path d="M11 1.2 Q1.2 1.2 1.2 11" stroke="white" strokeWidth="0.6" strokeOpacity="0.15" fill="none" strokeLinecap="round" />
      <path d="M11 29V11L29 29V11" stroke="url(#nGrad2)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#softGlow2)" />
    </svg>
    <span className="text-white text-xl font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
      Nexora
    </span>
  </div>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [focused, setFocused] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const { handleResetPassword } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }
    try {
      await handleResetPassword({ token, password: form.password });
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error) {
      toast.error(error?.message || "Password reset failed");
    }
  };

  // Invalid token guard
  if (!token) {
    return (
      <Shell>
        <Logo />
        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-white text-3xl font-bold mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" }}>
            Invalid link
          </h1>
          <p className="text-slate-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            This reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
        <Link
          to="/forgot-password"
          className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200
            bg-gradient-to-r from-violet-600 to-violet-500
            hover:from-violet-500 hover:to-cyan-500
            shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
            active:scale-[0.98]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Request new link
        </Link>
      </Shell>
    );
  }

  if (success) {
    return (
      <Shell>
        <Logo />
        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-white text-3xl font-bold mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" }}>
            Password updated
          </h1>
          <p className="text-slate-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200
            bg-gradient-to-r from-violet-600 to-violet-500
            hover:from-violet-500 hover:to-cyan-500
            shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
            active:scale-[0.98]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Sign in
        </button>
      </Shell>
    );
  }

  const fields = [
    {
      name: "password",
      label: "New Password",
      type: showPassword ? "text" : "password",
      placeholder: "••••••••••",
      show: showPassword,
      setShow: setShowPassword,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: showConfirm ? "text" : "password",
      placeholder: "••••••••••",
      show: showConfirm,
      setShow: setShowConfirm,
    },
  ];

  return (
    <Shell>
      <Logo />

      <div className="mb-8">
        <h1
          className="text-white text-3xl font-bold mb-1.5"
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" }}
        >
          Reset password
        </h1>
        <p className="text-slate-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Choose a strong new password for your account.
        </p>
      </div>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 backdrop-blur-sm shadow-2xl shadow-black/40">
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field) => (
            <div key={field.name}>
              <label
                className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-widest"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {field.label}
              </label>
              <div className="relative group">
                <div
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    focused === field.name ? "text-violet-400" : "text-slate-500"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  onFocus={() => setFocused(field.name)}
                  onBlur={() => setFocused("")}
                  required
                  minLength={8}
                  className={`w-full bg-white/[0.05] border text-white text-sm rounded-xl pl-10 pr-11 py-3 outline-none transition-all duration-200 placeholder-slate-600
                    ${
                      focused === field.name
                        ? "border-violet-500/70 shadow-[0_0_0_3px_rgba(139,92,246,0.12)] bg-white/[0.07]"
                        : "border-white/[0.08] hover:border-white/[0.14]"
                    }
                  `}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />

                <button
                  type="button"
                  onClick={() => field.setShow(!field.show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {field.show ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          ))}

          {/* Password match indicator */}
          {form.confirmPassword.length > 0 && (
            <div
              className={`flex items-center gap-2 text-xs ${
                form.password === form.confirmPassword ? "text-emerald-400" : "text-red-400"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {form.password === form.confirmPassword ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Passwords match
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Passwords do not match
                </>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-1 py-3 rounded-xl text-sm font-semibold text-white relative overflow-hidden group transition-all duration-200
              bg-gradient-to-r from-violet-600 to-violet-500
              hover:from-violet-500 hover:to-cyan-500
              shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
              active:scale-[0.98]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span className="relative z-10">Reset Password</span>
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-slate-500 mt-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        Remember your password?{" "}
        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </Shell>
  );
};

export default ResetPassword;
