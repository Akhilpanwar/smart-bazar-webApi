import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import cookieParser from "cookie-parser";
import { verifyJWT } from "./middleware/auth.middleware";
const CLIENT_ORIGIN = "http://localhost:5173";
const AUTH_URL = process.env.AUTH_SERVICE_URL || "http://127.0.0.1:4001";
const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || "http://127.0.0.1:4000";
const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://127.0.0.1:4002";
export const app = express();

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "smartbazar-api-gateway",
    upstream: { auth: AUTH_URL, product: PRODUCT_URL, user: USER_SERVICE_URL },
  });
});

const proxyOpts = { changeOrigin: true, xfwd: true } as const;

app.use(
  "/api/v1/products",
  createProxyMiddleware({
    target: PRODUCT_URL,
    ...proxyOpts,
  }),
);
app.use(
  "/api/v1/orders",
  verifyJWT,
  createProxyMiddleware({
    target: PRODUCT_URL,
    ...proxyOpts,
  }),
);
app.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: AUTH_URL,
    ...proxyOpts,
  }),
);
app.use(
  "/api/v1/users",
  verifyJWT,
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    ...proxyOpts,
  }),
);

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});
