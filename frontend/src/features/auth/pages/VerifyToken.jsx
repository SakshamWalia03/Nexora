import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const VerifyToken = () => {
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { handleVerifyToken } = useAuth();

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
        setMessage(
          data.message || "Your email has been verified successfully.",
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Verification failed. The link may be expired or invalid.",
        );
      }
    };

    setTimeout(() => {
      verify();
    }, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-sm text-center">
        {status === "loading" && (
          <>
            <div className="w-10 h-10 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-5" />
            <p className="text-gray-500 text-sm">Verifying your account…</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-7 h-7 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              You're verified!
            </h2>
            <p className="text-sm text-gray-500 mb-7 leading-relaxed">
              {message}
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-block w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verification failed
            </h2>
            <p className="text-sm text-gray-500 mb-7 leading-relaxed">
              {message}
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-block w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyToken;
