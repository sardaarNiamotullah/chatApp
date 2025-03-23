import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

export default router;
