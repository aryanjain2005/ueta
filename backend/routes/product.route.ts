import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  getProductsByIds,
} from "../controllers/product.controller";

const router = express.Router();

router.get("/multiple", getProductsByIds); // This should be first
router.get("/getProducts", getProducts);
router.post("/addProduct", addProduct);
router.get("/:objectId", getProductById);

export default router;
