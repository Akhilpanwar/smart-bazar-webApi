import express from "express";
const router = express.Router();
import { socialCallback, socialLogin } from "../controllers/social.controller";

router.get("/:provider", socialLogin);
router.get("/:provider/callback", socialCallback);

export default router;
