import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Please log in.",
      err: "No access token",
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired. Please refresh your token."
        : error.name === "JsonWebTokenError"
          ? "Invalid token. Please log in again."
          : "Authentication failed.";

    return res.status(401).json({ success: false, message });
  }
};
