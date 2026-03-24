import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.jsx";
import { Toaster } from "react-hot-toast";
import { store } from "./app/app.store.js";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          fontFamily: "DM Sans, sans-serif",
          fontSize: "13px",
          fontWeight: "500",
          background: "#fff",
          color: "#0a0e1a",
          border: "1px solid #e2e5f0",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          padding: "12px 16px",
        },
        success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
      }}
    />
    <App />
  </Provider>,
);
