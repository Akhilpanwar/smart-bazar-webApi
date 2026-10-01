import { createProxyMiddleware } from "http-proxy-middleware";
import { verifyJWT } from "./auth.middleware";

export const proxy = (
  target: string,
  protectedRoute = false,
  pathRewrite?: Record<string, string>,
) => {
  return [
    ...(protectedRoute ? [verifyJWT] : []),

    createProxyMiddleware({
      target,
      changeOrigin: true,
      xfwd: true,

      pathRewrite,
    }),
  ];
};
