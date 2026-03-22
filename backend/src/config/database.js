import mongoose from "mongoose";
import config from "./config.js";

export async function connectDB() {
  if (!config.MONGO_URI) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error("Error connecting DB:", error.message);
    process.exit(1);
  }
}
