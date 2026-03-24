import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import VerifyToken from "../features/auth/pages/VerifyToken.jsx";

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
    path: "/",
    element: <h1>Home Page</h1>,
  },
]);

export default router;
