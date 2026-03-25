import React, { useState } from "react";
import { Link } from "react-router";
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
    <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] rounded-full bg-violet-600 opacity-[0.12] blur-[100px] pointer-events-none" />
    <div className="absolute bottom-[-80px] right-[-60px] w-[320px] h-[320px] rounded-full bg-cyan-500 opacity-[0.10] blur-[90px] pointer-events-none" />
    <div className="relative z-10 w-full max-w-md">{children}</div>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>
  </div>
);

// ── Logo mark ────────────────────────────────────────────────────────────
const Logo = () => (
  <div className="flex items-center gap-3 mb-10">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1b0f3a" />
          <stop offset="1" stopColor="#0b1e35" />
        </linearGradient>
        <linearGradient id="nGrad" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="0.5" stopColor="#818cf8" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="rimGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0891b2" stopOpacity="0.5" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0.6" y="0.6" width="38.8" height="38.8" rx="11" fill="url(#bgGrad)" />
      <rect x="0.6" y="0.6" width="38.8" height="38.8" rx="11" fill="none" stroke="url(#rimGrad)" strokeWidth="1.2" />
      <path d="M11 1.2 Q1.2 1.2 1.2 11" stroke="white" strokeWidth="0.6" strokeOpacity="0.15" fill="none" strokeLinecap="round" />
      <path d="M11 29V11L29 29V11" stroke="url(#nGrad)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#softGlow)" />
    </svg>
    <span className="text-white text-xl font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
      Nexora
    </span>
  </div>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { handleForgotPassword } = useAuth();

  const loading = false; // or pull from selector if needed

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleForgotPassword({ email });
      setSubmitted(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (error) {
      toast.error(error?.message || "Failed to send reset email");
    }
  };

  return (
    <Shell>
      <Logo />

      {!submitted ? (
        <>
          <div className="mb-8">
            <h1
              className="text-white text-3xl font-bold mb-1.5"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" }}
            >
              Forgot password?
            </h1>
            <p className="text-slate-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 backdrop-blur-sm shadow-2xl shadow-black/40">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-widest"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Email
                </label>
                <div className="relative group">
                  <div
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      focused ? "text-violet-400" : "text-slate-500"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    placeholder="you@nexora.io"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    className={`w-full bg-white/[0.05] border text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all duration-200 placeholder-slate-600
                      ${
                        focused
                          ? "border-violet-500/70 shadow-[0_0_0_3px_rgba(139,92,246,0.12)] bg-white/[0.07]"
                          : "border-white/[0.08] hover:border-white/[0.14]"
                      }
                    `}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-1 py-3 rounded-xl text-sm font-semibold text-white relative overflow-hidden group transition-all duration-200
                  bg-gradient-to-r from-violet-600 to-violet-500
                  hover:from-violet-500 hover:to-cyan-500
                  shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
                  active:scale-[0.98]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <span className="relative z-10">Send Reset Link</span>
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1
              className="text-white text-3xl font-bold mb-1.5"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" }}
            >
              Check your inbox
            </h1>
            <p className="text-slate-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              We sent a password reset link to{" "}
              <span className="text-slate-300 font-medium">{email}</span>.
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 backdrop-blur-sm shadow-2xl shadow-black/40">
            <p className="text-slate-500 text-sm mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Didn't receive it? Check your spam folder or try again with a different email.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200
                bg-white/[0.06] border border-white/[0.08]
                hover:bg-white/[0.09] hover:border-white/[0.14]
                active:scale-[0.98]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Try again
            </button>
          </div>
        </>
      )}

      <p className="text-center text-sm text-slate-500 mt-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        Remember your password?{" "}
        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </Shell>
  );
};

export default ForgotPassword;
