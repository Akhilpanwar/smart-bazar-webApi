import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { verifyInternalKey } from "../middleware/InternalAuth";
const router = Router();

// Client routes
router.post("/me", userController.getUser); // or router.get("/me", userController.getUser)

// Internal route called by Auth Service
router.post(
  "/internal/profile",
  verifyInternalKey,
  userController.createProfileInternal,
);

export default router;
