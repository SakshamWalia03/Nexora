import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const VerifyToken = () => {
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("");
  const [resendStatus, setResendStatus] = useState("idle"); // 'idle' | 'sending' | 'sent' | 'error'
  const navigate = useNavigate();
  const { handleVerifyToken, handleResendVerification } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setTimeout(() => {
        setStatus("error");
        setMessage("No verification token found in the URL.");
      }, 0);
      return;
    }

    const verify = async () => {
      try {
        const data = await handleVerifyToken(token);
        setStatus("success");
        setMessage(data.message || "Your email has been verified successfully.");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Verification failed. The link may be expired or invalid."
        );
      }
    };

    setTimeout(() => {
      verify();
    }, 0);
  }, []);

  const handleResend = async () => {
    if (resendStatus === "sending" || resendStatus === "sent") return;
    setResendStatus("sending");
    try {
      await handleResendVerification();
      setResendStatus("sent");
    } catch {
      setResendStatus("error");
      setTimeout(() => setResendStatus("idle"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-[-120px] right-[-80px] w-[420px] h-[420px] rounded-full bg-violet-600 opacity-[0.10] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-60px] w-[320px] h-[320px] rounded-full bg-cyan-500 opacity-[0.08] blur-[90px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="vbgGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1b0f3a" />
                <stop offset="1" stopColor="#0b1e35" />
              </linearGradient>
              <linearGradient id="vnGrad" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#c4b5fd" />
                <stop offset="0.5" stopColor="#818cf8" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient id="vrimGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7c3aed" stopOpacity="0.9" />
                <stop offset="1" stopColor="#0891b2" stopOpacity="0.5" />
              </linearGradient>
              <filter id="vGlow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect x="0.6" y="0.6" width="38.8" height="38.8" rx="11" fill="url(#vbgGrad)" />
            <rect x="0.6" y="0.6" width="38.8" height="38.8" rx="11" fill="none" stroke="url(#vrimGrad)" strokeWidth="1.2" />
            <path d="M11 29V11L29 29V11" stroke="url(#vnGrad)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#vGlow)" />
          </svg>
          <span
            className="text-white text-xl font-semibold"
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
          >
            Nexora
          </span>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-black/40 text-center">

          {/* ── LOADING ── */}
          {status === "loading" && (
            <div className="py-4">
              <div className="relative w-14 h-14 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                <div
                  className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
                  style={{ borderTopColor: "#a78bfa" }}
                />
                <div className="absolute inset-[6px] rounded-full bg-violet-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-white text-lg font-semibold mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
                Verifying your email
              </h2>
              <p className="text-slate-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Hang tight, this only takes a moment…
              </p>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {status === "success" && (
            <div className="py-4">
              <div className="relative w-14 h-14 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/20" />
                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2
                className="text-white text-xl font-bold mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
              >
                You're verified!
              </h2>
              <p className="text-slate-400 text-sm mb-7 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {message}
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200
                  bg-gradient-to-r from-violet-600 to-violet-500
                  hover:from-violet-500 hover:to-cyan-500
                  shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
                  active:scale-[0.98]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Go to Login
              </button>
            </div>
          )}

          {/* ── ERROR ── */}
          {status === "error" && (
            <div className="py-4">
              <div className="relative w-14 h-14 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-red-500/10 border border-red-500/20" />
                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2
                className="text-white text-xl font-bold mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
              >
                Verification failed
              </h2>
              <p className="text-slate-400 text-sm mb-7 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {message}
              </p>

              {/* Resend button */}
              <button
                onClick={handleResend}
                disabled={resendStatus === "sending" || resendStatus === "sent"}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 mb-3 flex items-center justify-center gap-2
                  ${resendStatus === "sent"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default"
                    : resendStatus === "error"
                    ? "bg-red-500/10 border border-red-500/20 text-red-400 cursor-default"
                    : "bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-cyan-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-[0.98] text-white"
                  }
                  disabled:opacity-80
                `}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {resendStatus === "sending" && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {resendStatus === "sent" && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {resendStatus === "error" && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {resendStatus === "idle" && "Resend Verification Email"}
                {resendStatus === "sending" && "Sending…"}
                {resendStatus === "sent" && "Email sent — check your inbox"}
                {resendStatus === "error" && "Failed to send — try again"}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-xl text-sm font-semibold text-slate-300 transition-all duration-200
                  bg-white/[0.06] border border-white/[0.08]
                  hover:bg-white/[0.10] hover:border-white/[0.14]
                  active:scale-[0.98]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyToken;