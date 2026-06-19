import { Router } from "express";
import * as authController from "./auth.controller";
import { validateBody } from "../../middleware/validate";
import { changePasswordSchema, loginSchema, refreshTokenSchema } from "./auth.schema";
import { authenticate } from "../../middleware/authenticate";
import { loginLimiter, loginSlowDown, refreshLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/login", loginLimiter, loginSlowDown, validateBody(loginSchema), authController.login);
router.post("/refresh", refreshLimiter, validateBody(refreshTokenSchema), authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);
router.post(
  "/change-password",
  authenticate,
  validateBody(changePasswordSchema),
  authController.changePassword
);

export default router;
