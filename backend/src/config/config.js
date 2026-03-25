import "dotenv/config";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "GOOGLE_CLIENT_SECRET is not defined in environment variables",
  );
}

if (!process.env.GOOGLE_REFRESH_TOKEN) {
  throw new Error(
    "GOOGLE_REFRESH_TOKEN is not defined in environment variables",
  );
}

if (!process.env.GOOGLE_USER) {
  throw new Error("GOOGLE_USER is not defined in environment variables");
}

if (!process.env.MISTRAL_API_KEY) {
  throw new Error("GOOGLE_USER is not defined in environment variables");
}

if (!process.env.TAVILY_API_KEY) {
  throw new Error("TAVILY_API_KEY is not defined in environment variables");
}

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_USER: process.env.GOOGLE_USER,
  FRONTEND_URL: process.env.FRONTEND_URL,
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  TAVILY_API_KEY: process.env.TAVILY_API_KEY
};

export default config;
