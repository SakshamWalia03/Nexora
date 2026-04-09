import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { loginWithGoogle, loginWithGithub } from "../service/auth.api.js";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useAuth();

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(form);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Login failed");
    }
  };

  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "you@nexora.io",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      placeholder: "••••••••••",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
  ];

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] rounded-full bg-violet-600 opacity-[0.12] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-60px] w-[320px] h-[320px] rounded-full bg-cyan-500 opacity-[0.10] blur-[90px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="bgGrad"
                x1="0"
                y1="0"
                x2="40"
                y2="40"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#1b0f3a" />
                <stop offset="1" stopColor="#0b1e35" />
              </linearGradient>
              <linearGradient
                id="nGrad"
                x1="10"
                y1="10"
                x2="30"
                y2="30"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#c4b5fd" />
                <stop offset="0.5" stopColor="#818cf8" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient
                id="rimGrad"
                x1="0"
                y1="0"
                x2="40"
                y2="40"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7c3aed" stopOpacity="0.9" />
                <stop offset="1" stopColor="#0891b2" stopOpacity="0.5" />
              </linearGradient>
              <filter
                id="softGlow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="1.2"
                  result="blur"
                />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect
              x="0.6"
              y="0.6"
              width="38.8"
              height="38.8"
              rx="11"
              fill="url(#bgGrad)"
            />
            <rect
              x="0.6"
              y="0.6"
              width="38.8"
              height="38.8"
              rx="11"
              fill="none"
              stroke="url(#rimGrad)"
              strokeWidth="1.2"
            />
            <path
              d="M11 1.2 Q1.2 1.2 1.2 11"
              stroke="white"
              strokeWidth="0.6"
              strokeOpacity="0.15"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M11 29V11L29 29V11"
              stroke="url(#nGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#softGlow)"
            />
          </svg>
          <span
            className="text-white text-xl font-semibold"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Nexora
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1
            className="text-white text-3xl font-bold mb-1.5"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            Welcome back
          </h1>
          <p
            className="text-slate-400 text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Sign in to continue building with Nexora.
          </p>
        </div>

        {/* Form card */}
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
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused === field.name ? "text-violet-400" : "text-slate-500"}`}
                  >
                    {field.icon}
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
                    className={`w-full bg-white/[0.05] border text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all duration-200 placeholder-slate-600
                      ${focused === field.name ? "border-violet-500/70 shadow-[0_0_0_3px_rgba(139,92,246,0.12)] bg-white/[0.07]" : "border-white/[0.08] hover:border-white/[0.14]"}
                      ${field.name === "password" ? "pr-11" : ""}
                    `}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  {field.name === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <Link
                to="/forgot-password"
                className="text-xs text-slate-500 hover:text-violet-400 transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Forgot password?
              </Link>
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
              <span className="relative z-10">Sign In</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span
              className="text-xs text-slate-600"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              or continue with
            </span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={loginWithGoogle}
              className="flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.15] transition-all duration-200 active:scale-[0.98] group"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                Google
              </span>
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={loginWithGithub}
              className="flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.15] transition-all duration-200 active:scale-[0.98] group"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg
                className="w-4 h-4 shrink-0 text-slate-300 group-hover:text-white transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                GitHub
              </span>
            </button>
          </div>
        </div>

        <p
          className="text-center text-sm text-slate-500 mt-6"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
