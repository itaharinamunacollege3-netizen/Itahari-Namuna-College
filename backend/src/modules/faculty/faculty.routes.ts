import { Router } from "express";
import * as facultyController from "./faculty.controller";
import { validateBody, validateQuery } from "../../middleware/validate";
import {
  createFacultySchema,
  listFacultyQuerySchema,
  publicFacultyQuerySchema,
  updateFacultySchema,
} from "./faculty.schema";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";
import { upload } from "../../config/upload";

const publicRouter = Router();
publicRouter.get("/", validateQuery(publicFacultyQuerySchema), facultyController.listPublic);
publicRouter.get("/:id", facultyController.getById);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", validateQuery(listFacultyQuerySchema), facultyController.listAdmin);
adminRouter.post(
  "/",
  upload("faculty").single("photo"),
  validateBody(createFacultySchema),
  facultyController.create
);
adminRouter.patch(
  "/:id",
  upload("faculty").single("photo"),
  validateBody(updateFacultySchema),
  facultyController.update
);
adminRouter.delete("/:id", facultyController.remove);

export { publicRouter as facultyPublicRoutes, adminRouter as facultyAdminRoutes };
