// src/config/db.config.ts
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      console.error("Missing MONGO_URI or MONGODB_URI");
      process.exit(1);
    }
    const conn = await mongoose.connect(uri);
    console.log(
      `🚀 Connected to Database: ${conn.connection.db?.databaseName}`,
    );
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
