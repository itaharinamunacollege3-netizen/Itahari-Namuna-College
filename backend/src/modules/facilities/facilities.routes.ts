import { Router } from "express";
import * as facilitiesController from "./facilities.controller";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate";
import {
  facilityIdParamSchema,
  createFacilitySchema,
  listFacilitiesQuerySchema,
  updateFacilitySchema,
} from "./facilities.schema";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";
import { runSingleImageUpload, runFacilityFileUpload } from "../../middleware/upload";
import { uploadLimiter } from "../../middleware/rateLimiter";
import { z } from "zod";

const adminFacilityIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const publicRouter = Router();

publicRouter.get("/", validateQuery(listFacilitiesQuerySchema), facilitiesController.listPublic);
publicRouter.get("/featured", facilitiesController.getFeatured);
publicRouter.get("/categories", facilitiesController.getCategories);
publicRouter.get("/:id", validateParams(facilityIdParamSchema), facilitiesController.getById);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", validateQuery(listFacilitiesQuerySchema), facilitiesController.listAdmin);
adminRouter.get("/:id", validateParams(adminFacilityIdParamSchema), facilitiesController.getAdminById);
adminRouter.post(
  "/",
  uploadLimiter,
  runFacilityFileUpload(),
  validateBody(createFacilitySchema),
  facilitiesController.create
);
adminRouter.patch(
  "/:id",
  uploadLimiter,
  validateParams(adminFacilityIdParamSchema),
  runFacilityFileUpload(),
  validateBody(updateFacilitySchema),
  facilitiesController.update
);
adminRouter.delete("/:id", validateParams(adminFacilityIdParamSchema), facilitiesController.remove);
adminRouter.post(
  "/:id/image",
  uploadLimiter,
  validateParams(adminFacilityIdParamSchema),
  runSingleImageUpload("image"),
  facilitiesController.uploadCover
);
adminRouter.delete("/:id/image", validateParams(adminFacilityIdParamSchema), facilitiesController.removeCover);

export { publicRouter as facilitiesPublicRoutes, adminRouter as facilitiesAdminRoutes };
