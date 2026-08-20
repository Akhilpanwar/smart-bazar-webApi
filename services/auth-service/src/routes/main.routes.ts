import express from "express";
import authRoutes from "./auth.routes";
import socialRoutes from "./social.routes";

const router = express.Router();
router.use("/", authRoutes);
router.use("/oauth", socialRoutes);

export default router;
