import { Router } from "express";
import {
  getBrands,
  addBrand,
  getBrandById,
  getBrandsByProductId,
} from "../controllers/brand.controller";

const router: Router = Router();

router.get("/byProduct/:objectId", getBrandsByProductId);
router.get("/getBrands", getBrands);
router.post("/addBrand", addBrand);
router.get("/:objectId", getBrandById);

export default router;
