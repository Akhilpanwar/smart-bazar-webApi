import express from "express";

const router = express.Router();
router.get("/", (req, res) => {
  res.json({ message: "Cart service is running" });
});
export default router;
