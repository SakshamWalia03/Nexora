import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import VerifyToken from "../features/auth/pages/VerifyToken.jsx";
import ForgotPassword from "../features/auth/pages/ForgotPassword.jsx";
import ResetPassword from "../features/auth/pages/ResetPassword.jsx";
import Dashboard from "../features/chat/pages/Dashboard.jsx";
import Protected from "../features/auth/components/Protected.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
  {
    path: "/verify",
    element: <VerifyToken />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
]);

export default router;
