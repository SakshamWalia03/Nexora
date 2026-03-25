import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center flex-col gap-6 z-[9999]">
        {/* Animated rings */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-500 rounded-full animate-spin animate-pulse" 
               style={{ animationDuration: "1.5s" }} />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-indigo-400 text-sm font-semibold tracking-wide animate-pulse">
            NEXORA
          </p>
          <p className="text-gray-400 text-xs font-medium tracking-wider">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;