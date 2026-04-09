import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
  resetPasswordValidator,
} from "../validators/auth.validator.js";
import { authenticate } from "../middleware/authenticate.middleware.js";

const router = Router();

// Email / password
router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/refresh", refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordValidator, resetPassword);

// Email verification
router.get("/verify-email", verifyEmail);

// Protected
router.get("/get-me", authenticate, getMe);
router.post("/logout", authenticate, logout);
router.post("/logout-all", authenticate, logoutAll);

// OAuth — Google
router.get("/google", googleAuth);
router.get("/google/callback", ...googleCallback);

// OAuth — GitHub
router.get("/github", githubAuth);
router.get("/github/callback", ...githubCallback);

export default router;