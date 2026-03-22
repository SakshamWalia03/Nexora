import mongoose from "mongoose";
import crypto from "crypto"

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    rotatedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RefreshToken",
      default: null,
    },

    lastUsedAt: {
      type: Date,
      default: Date.now,
    },

    // ── Security audit fields ──
    userAgent: {
      type: String,
      default: null,
    },

    ip: {
      type: String,
      default: null,
    },

    deviceInfo: {
      browser: { type: String, default: null },
      os: { type: String, default: null },
      device: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  },
);

// Auto-delete expired tokens via MongoDB TTL
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Fast lookups by userId (e.g. logout all sessions)
refreshTokenSchema.index({ userId: 1 });

// Hash raw refresh token before storing
refreshTokenSchema.statics.hashToken = function (rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};

// Extract real client IP from req object
refreshTokenSchema.statics.getClientIP = function (req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

// Parse basic device info from User-Agent string
// Usage: RefreshToken.parseUserAgent(req.headers["user-agent"])
refreshTokenSchema.statics.parseUserAgent = function (ua = "") {
  const browser =
    ua.match(/Chrome\/([\d]+)/)?.[0] ||
    ua.match(/Firefox\/([\d]+)/)?.[0] ||
    ua.match(/Safari\/([\d]+)/)?.[0] ||
    ua.match(/Edge\/([\d]+)/)?.[0] ||
    "Unknown Browser";

  const os = ua.includes("Windows NT 10")
    ? "Windows 10/11"
    : ua.includes("Windows NT")
      ? "Windows"
      : ua.includes("Mac OS X")
        ? "macOS"
        : ua.includes("Android")
          ? "Android"
          : ua.includes("iPhone")
            ? "iOS"
            : ua.includes("Linux")
              ? "Linux"
              : "Unknown OS";

  const device =
    ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")
      ? "Mobile"
      : "Desktop";

  return { browser, os, device };
};

// Check if token is still usable
refreshTokenSchema.methods.isValid = function () {
  return !this.isRevoked && this.expiresAt > new Date();
};

const refreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);

export default refreshTokenModel;
