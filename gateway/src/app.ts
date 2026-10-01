import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import healthRoutes from "./routes/health.routes";
import proxyRoutes from "./routes/proxy.routes";

export const app = express();

app.set("trust proxy", 1);

app.use(cookieParser());

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Infrastructure routes
app.use("/health", healthRoutes);

// API routes
app.use("/api/v1", proxyRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});
