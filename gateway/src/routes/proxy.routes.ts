import { Router } from "express";

import { proxy } from "../middleware/proxy.middleware";
import { env } from "../config/env";
import { verifyInternalKey } from "../middleware/InternalAuth.middleware";

const router = Router();

// Public product APIs
router.use(
  "/products",
  ...proxy(env.services.product, false, {
    "^/products": "/api/products",
  }),
);

// Internal User Service APIs
router.use(
  "/internal-user-service",
  verifyInternalKey,
  ...proxy(env.services.user, false, {
    "^/": "/api/internal/users/",
  }),
);

// Protected User APIs
router.use(
  "/users",
  ...proxy(env.services.user, true, {
    "^/": "/api/users/",
  }),
);

// Protected Order APIs
router.use(
  "/orders",
  ...proxy(env.services.order, true, {
    "^/": "/api/orders/",
  }),
);

// Protected Payment APIs
router.use(
  "/payment",
  ...proxy(env.services.payment, true, {
    "^/": "/api/payments/",
  }),
);

// Protected Cart APIs
router.use(
  "/cart",
  ...proxy(env.services.cart, true, {
    "^/": "/api/cart/",
  }),
);

// Auth APIs
router.use(
  "/auth",
  ...proxy(env.services.auth, false, {
    "^/": "/api/auth/",
  }),
);

export default router;
