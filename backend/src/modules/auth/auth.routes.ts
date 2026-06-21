import { Router } from "express";
import * as authController from "./auth.controller";
import { validateBody } from "../../middleware/validate";
import {
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
} from "./auth.schema";
import { authenticate } from "../../middleware/authenticate";
import {
  loginLimiter,
  loginSlowDown,
  refreshLimiter,
  uploadLimiter,
} from "../../middleware/rateLimiter";
import { runSingleImageUpload } from "../../middleware/upload";

const router = Router();

router.post("/login", loginLimiter, loginSlowDown, validateBody(loginSchema), authController.login);
router.post("/refresh", refreshLimiter, validateBody(refreshTokenSchema), authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);
router.patch("/profile", authenticate, validateBody(updateProfileSchema), authController.updateProfile);
router.post(
  "/avatar",
  authenticate,
  uploadLimiter,
  runSingleImageUpload("avatar"),
  authController.uploadAvatar
);
router.post(
  "/change-password",
  authenticate,
  validateBody(changePasswordSchema),
  authController.changePassword
);

export default router;
