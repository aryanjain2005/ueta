import express from "express";
import { addProduct, getProducts } from "../controllers/product.controller";

const router = express.Router();

router.get("/getProducts", getProducts);
router.post("/addProduct", addProduct);

export default router;
