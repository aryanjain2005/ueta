import { Router } from "express";
import { getBrands, addBrand } from "../controllers/brand.controller";

const router: Router = Router();

router.get("/getBrands", getBrands);
router.post("/addBrand", addBrand);

export default router;
