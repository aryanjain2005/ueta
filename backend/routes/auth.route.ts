import { Router } from "express";
import { signupController } from "../controllers/auth.controller"; // Adjust path as necessary

const router = Router();

router.post("/signup", signupController);

export default router;
