// routes/userRoutes.ts
import { Router } from "express";
import {
  signupController,
  getUsersByBrandProd,
  getDealers,
  addDealer,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signupController);
router.get("/byBrandProd/:objectId", getUsersByBrandProd);
router.get("/getDealers", getDealers); // New route to get dealers
router.post("/addDealer", addDealer); // New route to add dealer

export default router;
