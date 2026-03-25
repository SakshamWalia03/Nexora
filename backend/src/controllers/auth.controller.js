import crypto from "crypto";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import refreshTokenModel from "../models/refreshToken.model.js";
import config from "../config/config.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendVerifiedEmail,
} from "../services/emailService.js";

// ── Token helpers ──
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, username: user.username },
    config.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const rawRefreshToken = crypto.randomBytes(64).toString("hex");

  return { accessToken, rawRefreshToken };
};

const setTokenCookies = (res, accessToken, rawRefreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", rawRefreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const saveRefreshToken = async (
  userId,
  rawRefreshToken,
  req,
  rotatedFrom = null,
) => {
  const ua = req.headers["user-agent"] || "";

  return refreshTokenModel.create({
    userId,
    tokenHash: refreshTokenModel.hashToken(rawRefreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: ua,
    ip: refreshTokenModel.getClientIP(req),
    deviceInfo: refreshTokenModel.parseUserAgent(ua),
    rotatedFrom,
  });
};

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export async function register(req, res) {
  const { username, email, password } = req.body;

  const existing = await userModel.findOne({ $or: [{ email }, { username }] });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: "User with this email or username already exists",
      err: "User already exists",
    });
  }

  const user = await userModel.create({ username, email, password });

  await sendVerificationEmail(email);

  return res.status(201).json({
    success: true,
    message: "Registered successfully. Please verify your email.",
    user: { id: user._id, username: user.username, email: user.email },
  });
}

/**
 * @desc Login — sets accessToken + refreshToken as httpOnly cookies
 * @route POST /api/auth/login
 * @access Public
 */
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
      err: "Invalid credentials",
    });
  }

  if (!user.verified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email before logging in",
      err: "Email not verified",
    });
  }

  const { accessToken, rawRefreshToken } = generateTokens(user);

  await saveRefreshToken(user._id, rawRefreshToken, req);

  setTokenCookies(res, accessToken, rawRefreshToken);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: { id: user._id, username: user.username, email: user.email },
  });
}

/**
 * @desc Refresh access token via refresh token cookie (with rotation)
 * @route POST /api/auth/refresh
 * @access Public
 */
export async function refresh(req, res) {
  const rawRefreshToken = req.cookies?.refreshToken;
  console.log(rawRefreshToken);

  if (!rawRefreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token" });
  }

  const tokenHash = refreshTokenModel.hashToken(rawRefreshToken);
  const storedToken = await refreshTokenModel.findOne({ tokenHash });

  if (!storedToken || !storedToken.isValid()) {
    // Potential reuse attack — revoke all sessions for this user
    if (storedToken) {
      await refreshTokenModel.updateMany(
        { userId: storedToken.userId },
        { isRevoked: true, revokedAt: new Date() },
      );
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }

  const user = await userModel.findById(storedToken.userId);

  if (!user)
    return res.status(401).json({ success: false, message: "User not found" });

  // Revoke current token (rotation)
  storedToken.isRevoked = true;
  storedToken.revokedAt = new Date();
  await storedToken.save();

  // Issue new token pair
  const { accessToken, rawRefreshToken: newRawRefreshToken } =
    generateTokens(user);

  await saveRefreshToken(user._id, newRawRefreshToken, req, storedToken._id);

  setTokenCookies(res, accessToken, newRawRefreshToken);

  return res.status(200).json({ success: true, message: "Token refreshed" });
}

/**
 * @desc Logout — revoke current refresh token and clear cookies
 * @route POST /api/auth/logout
 * @access Private
 */
export async function logout(req, res) {
  const rawRefreshToken = req.cookies?.refreshToken;

  if (rawRefreshToken) {
    const tokenHash = refreshTokenModel.hashToken(rawRefreshToken);
    await refreshTokenModel.findOneAndUpdate(
      { tokenHash },
      { isRevoked: true, revokedAt: new Date() },
    );
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
}

/**
 * @desc Logout from all devices — revoke all refresh tokens
 * @route POST /api/auth/logout-all
 * @access Private
 */
export async function logoutAll(req, res) {
  await refreshTokenModel.updateMany(
    { userId: req.user.id, isRevoked: false },
    { isRevoked: true, revokedAt: new Date() },
  );

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res
    .status(200)
    .json({ success: true, message: "Logged out from all devices" });
}

/**
 * @desc Get current logged in user
 * @route GET /api/auth/get-me
 * @access Private
 */
export async function getMe(req, res) {
  const user = await userModel.findById(req.user.id).select("-password");

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  return res.status(200).json({ success: true, user });
}

/**
 * @desc Verify user email via JWT link
 * @route GET /api/auth/verify-email
 * @access Public
 */
export async function verifyEmail(req, res) {
  const { token } = req.query;

  if (!token)
    return res
      .status(400)
      .json({ success: false, message: "Token is missing" });

  try {
    const { email, purpose } = jwt.verify(token, config.JWT_SECRET);

    if (purpose !== "email-verification")
      return res.status(400).json({ success: false, message: "Invalid token" });

    const user = await userModel.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    if (user.verified)
      return res
        .status(200)
        .json({ success: true, message: "Already verified. You can log in." });

    user.verified = true;
    await user.save();
    await sendVerifiedEmail(email);

    return res
      .status(200)
      .json({ success: true, message: "Email verified. You can now log in." });
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Verification link has expired."
        : error.name === "JsonWebTokenError"
          ? "Invalid verification link."
          : "Something went wrong. Please try again.";

    return res.status(400).json({ success: false, message });
  }
}

/**
 * @desc Forgot password — send reset link
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export async function forgotPassword(req, res) {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If this email exists, a reset link has been sent",
    });
  }

  const resetToken = jwt.sign(
    { email: user.email, purpose: "reset-password" },
    config.JWT_SECRET,
    { expiresIn: "10m" }
  );

  const resetLink = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendPasswordResetEmail(email, resetLink);

  return res.status(200).json({
    success: true,
    message: "Password reset link sent to email",
  });
}

/**
 * @desc Reset password
 * @route POST /api/auth/reset-password
 * @access Public
 */
export async function resetPassword(req, res) {
  const { token } = req.query;
  const { password } = req.body;
  console.log(token);

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required",
    });
  }

  try {
    const { email, purpose } = jwt.verify(token, config.JWT_SECRET);
  
    if (purpose !== "reset-password") {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await userModel.findOne({ email });

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = password;
    await user.save();

    await refreshTokenModel.updateMany(
      { userId: user._id },
      { isRevoked: true, revokedAt: new Date() }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Reset link expired"
        : "Invalid or expired token";

    return res.status(400).json({ success: false, message });
  }
}
