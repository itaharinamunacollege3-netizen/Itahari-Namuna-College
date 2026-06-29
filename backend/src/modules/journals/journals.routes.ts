import { Router } from "express";
import * as journalsController from "./journals.controller";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate";
import {
  createJournalSchema,
  journalIdParamSchema,
  listJournalsQuerySchema,
  updateJournalSchema,
} from "./journals.schema";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";
import {
  runJournalFileUpload,
  runSingleImageUpload,
  runSinglePdfUpload,
} from "../../middleware/upload";
import { uploadLimiter } from "../../middleware/rateLimiter";
import { z } from "zod";

const adminJournalIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const publicRouter = Router();

publicRouter.get("/", validateQuery(listJournalsQuerySchema), journalsController.listPublic);
publicRouter.get("/featured", journalsController.getFeatured);
publicRouter.get("/popular", journalsController.getPopular);
publicRouter.get("/fields", journalsController.getFields);
publicRouter.get("/:id/related", validateParams(journalIdParamSchema), journalsController.getRelated);
publicRouter.get("/:id", validateParams(journalIdParamSchema), journalsController.getById);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", validateQuery(listJournalsQuerySchema), journalsController.listAdmin);
adminRouter.get("/:id", validateParams(adminJournalIdParamSchema), journalsController.getAdminById);
adminRouter.post(
  "/",
  uploadLimiter,
  runJournalFileUpload(),
  validateBody(createJournalSchema),
  journalsController.create
);
adminRouter.patch(
  "/:id",
  uploadLimiter,
  validateParams(adminJournalIdParamSchema),
  runJournalFileUpload(),
  validateBody(updateJournalSchema),
  journalsController.update
);
adminRouter.delete("/:id", validateParams(adminJournalIdParamSchema), journalsController.remove);
adminRouter.post(
  "/:id/cover",
  uploadLimiter,
  validateParams(adminJournalIdParamSchema),
  runSingleImageUpload("cover"),
  journalsController.uploadCover
);
adminRouter.post(
  "/:id/pdf",
  uploadLimiter,
  validateParams(adminJournalIdParamSchema),
  runSinglePdfUpload("pdf"),
  journalsController.uploadPdf
);
adminRouter.delete("/:id/cover", validateParams(adminJournalIdParamSchema), journalsController.removeCover);
adminRouter.delete("/:id/pdf", validateParams(adminJournalIdParamSchema), journalsController.removePdf);

export { publicRouter as journalsPublicRoutes, adminRouter as journalsAdminRoutes };
