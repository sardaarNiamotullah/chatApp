import { Router } from "express";
import * as authController from "../controllers/authController";
import passport from "passport";
import "../passport/googleStrategy";

const router = Router();

// Existing routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Google OAuth2 routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  authController.googleOAuthCallback // ✅ TypeScript workaround
);

export default router;
