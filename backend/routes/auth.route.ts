// routes/userRoutes.ts
import { Router } from "express";
import {
  signupController,
  getUsersByBrandProd,
  getDealers,
  getUserById,
  getDistributors,
} from "../controllers/auth.controller";

const router = Router();

router.get("/getUserById/:objectId", getUserById);
router.post("/signup", signupController);
router.get("/byBrandProd/:objectId", getUsersByBrandProd);
router.get("/getDealers", getDealers); // New route to get dealers
router.get("/getDistributors", getDistributors);

export default router;
