import { Router } from "express";
import * as unitsController from "./units.controller";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate";
import {
  unitIdParamSchema,
  createUnitSchema,
  listUnitsQuerySchema,
  updateUnitSchema,
} from "./units.schema";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";
import { runSingleImageUpload, runUnitFileUpload } from "../../middleware/upload";
import { uploadLimiter } from "../../middleware/rateLimiter";
import { z } from "zod";

const adminUnitIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const publicRouter = Router();

publicRouter.get("/", validateQuery(listUnitsQuerySchema), unitsController.listPublic);
publicRouter.get("/featured", unitsController.getFeatured);
publicRouter.get("/categories", unitsController.getCategories);
publicRouter.get("/:id", validateParams(unitIdParamSchema), unitsController.getById);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", validateQuery(listUnitsQuerySchema), unitsController.listAdmin);
adminRouter.get("/:id", validateParams(adminUnitIdParamSchema), unitsController.getAdminById);
adminRouter.post(
  "/",
  uploadLimiter,
  runUnitFileUpload(),
  validateBody(createUnitSchema),
  unitsController.create
);
adminRouter.patch(
  "/:id",
  uploadLimiter,
  validateParams(adminUnitIdParamSchema),
  runUnitFileUpload(),
  validateBody(updateUnitSchema),
  unitsController.update
);
adminRouter.delete("/:id", validateParams(adminUnitIdParamSchema), unitsController.remove);
adminRouter.post(
  "/:id/icon",
  uploadLimiter,
  validateParams(adminUnitIdParamSchema),
  runSingleImageUpload("icon"),
  unitsController.uploadIcon
);
adminRouter.delete("/:id/icon", validateParams(adminUnitIdParamSchema), unitsController.removeIcon);

export { publicRouter as unitsPublicRoutes, adminRouter as unitsAdminRoutes };
