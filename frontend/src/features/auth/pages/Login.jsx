import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useAuth();

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
        {/* ── Logo ── */}
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
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      focused === field.name
                        ? "text-violet-400"
                        : "text-slate-500"
                    }`}
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
                      ${
                        focused === field.name
                          ? "border-violet-500/70 shadow-[0_0_0_3px_rgba(139,92,246,0.12)] bg-white/[0.07]"
                          : "border-white/[0.08] hover:border-white/[0.14]"
                      }
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
              <button
                type="button"
                className="text-xs text-slate-500 hover:text-violet-400 transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Forgot password?
              </button>
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
        </div>

        <p
          className="text-center text-sm text-slate-500 mt-6"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Don't have an account?{" "}
          <Link
            to={"/signup"}
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
