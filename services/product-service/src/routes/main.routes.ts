import { Router } from "express";
import productRoutes from "./product.routes";

/** Catalog API only — auth is `@smartbazar/auth-service` behind the API gateway. */
const router = Router();

router.use("/product-service", productRoutes);

export default router;
