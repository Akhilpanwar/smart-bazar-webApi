import mongoose from "mongoose";
import config from "./app";

const connectDB = async () => {
  const uri =
    (config.MONGO_URI as string | undefined) ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      "Missing MongoDB URI. Set MONGO_URI (or MONGODB_URI) in .env — see .env.example",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
