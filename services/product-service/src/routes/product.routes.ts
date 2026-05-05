import express from "express";
import productController from "../controllers/product.controller";

const router = express.Router();

router.get("/", productController.getAllProducts);

router.get("/trending", productController.getTrendingProducts);
router.get("/hot-deals", productController.getHotDeals);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/categories", productController.getProductsCategory);
router.get("/:id", productController.getProduct);

router.post("/", productController.createProduct);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

export default router;
