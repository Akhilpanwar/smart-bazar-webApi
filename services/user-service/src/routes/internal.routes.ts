import { Router } from "express";
import { userController } from "../controllers/user.controller";
const router = Router();

router.post("/create-profile", userController.createProfileInternal);
export default router;
