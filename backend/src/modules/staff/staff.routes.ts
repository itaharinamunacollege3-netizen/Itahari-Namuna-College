import { Router } from "express";
import * as staffController from "./staff.controller";
import { validateBody, validateQuery } from "../../middleware/validate";
import {
  createStaffSchema,
  listStaffQuerySchema,
  publicStaffQuerySchema,
  updateStaffSchema,
} from "./staff.schema";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";
import { upload } from "../../config/upload";

const publicRouter = Router();
publicRouter.get("/", validateQuery(publicStaffQuerySchema), staffController.listPublic);
publicRouter.get("/:id", staffController.getById);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", validateQuery(listStaffQuerySchema), staffController.listAdmin);
adminRouter.post(
  "/",
  upload("staff").single("photo"),
  validateBody(createStaffSchema),
  staffController.create
);
adminRouter.patch(
  "/:id",
  upload("staff").single("photo"),
  validateBody(updateStaffSchema),
  staffController.update
);
adminRouter.delete("/:id", staffController.remove);

export { publicRouter as staffPublicRoutes, adminRouter as staffAdminRoutes };
