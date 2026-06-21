import { Router } from "express";
import * as programsController from "./programs.controller";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate";
import {
  createProgramSchema,
  listProgramsQuerySchema,
  programIdParamSchema,
  programSemesterParamSchema,
  programSlugParamSchema,
  publicListProgramsQuerySchema,
  reorderProgramsSchema,
  updateProgramSchema,
} from "./programs.schema";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";
import { runSingleNoticeImageUpload, runSinglePdfUpload } from "../../middleware/upload";
import { uploadLimiter } from "../../middleware/rateLimiter";

const publicRouter = Router();

publicRouter.get("/", validateQuery(publicListProgramsQuerySchema), programsController.listPublic);
publicRouter.get("/:slug", validateParams(programSlugParamSchema), programsController.getBySlug);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);

adminRouter.get("/", validateQuery(listProgramsQuerySchema), programsController.listAdmin);
adminRouter.patch("/reorder", validateBody(reorderProgramsSchema), programsController.reorder);
adminRouter.get("/:id", validateParams(programIdParamSchema), programsController.getAdminById);
adminRouter.post("/", validateBody(createProgramSchema), programsController.create);
adminRouter.patch("/:id", validateParams(programIdParamSchema), validateBody(updateProgramSchema), programsController.update);
adminRouter.delete("/:id", validateParams(programIdParamSchema), programsController.remove);

adminRouter.post(
  "/:id/image",
  uploadLimiter,
  validateParams(programIdParamSchema),
  runSingleNoticeImageUpload("image"),
  programsController.uploadCover
);
adminRouter.delete("/:id/image", validateParams(programIdParamSchema), programsController.removeCover);
adminRouter.post(
  "/:id/syllabus/:semester/pdf",
  uploadLimiter,
  validateParams(programSemesterParamSchema),
  runSinglePdfUpload("pdf"),
  programsController.uploadSemesterSyllabus
);

export { publicRouter as programsPublicRoutes, adminRouter as programsAdminRoutes };
