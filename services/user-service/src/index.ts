import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.config";
import userRoutes from "./routes/user.routes";
import internalUserRoutes from "./routes/internal.routes";
dotenv.config();
const app = express();

const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/internal/users", internalUserRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`user service listening on http://localhost:${PORT}`);
});
