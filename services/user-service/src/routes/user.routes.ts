import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

// Client routes
router.post("/me", userController.getUser); // or router.get("/me", userController.getUser)

// Internal route called by Auth Service

router.post("/internal/profile", userController.createProfileInternal);

export default router;
