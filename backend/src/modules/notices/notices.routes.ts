import { Router } from "express";
import * as noticesController from "./notices.controller";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate";
import {
  createNoticeSchema,
  listNoticesQuerySchema,
  noticeIdParamSchema,
  updateNoticeSchema,
} from "./notices.schema";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";
import {
  runNoticeFileUpload,
  runSingleNoticeImageUpload,
  runSinglePdfUpload,
} from "../../middleware/upload";
import { uploadLimiter } from "../../middleware/rateLimiter";

const publicRouter = Router();

publicRouter.get("/", validateQuery(listNoticesQuerySchema), noticesController.listPublic);
publicRouter.get("/featured", noticesController.getFeatured);
publicRouter.get("/:id", validateParams(noticeIdParamSchema), noticesController.getById);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", validateQuery(listNoticesQuerySchema), noticesController.listAdmin);
adminRouter.get("/:id", validateParams(noticeIdParamSchema), noticesController.getAdminById);
adminRouter.post(
  "/",
  uploadLimiter,
  runNoticeFileUpload(),
  validateBody(createNoticeSchema),
  noticesController.create
);
adminRouter.patch(
  "/:id",
  uploadLimiter,
  validateParams(noticeIdParamSchema),
  runNoticeFileUpload(),
  validateBody(updateNoticeSchema),
  noticesController.update
);
adminRouter.delete("/:id", validateParams(noticeIdParamSchema), noticesController.remove);

adminRouter.post(
  "/:id/pdf",
  uploadLimiter,
  validateParams(noticeIdParamSchema),
  runSinglePdfUpload("pdf"),
  noticesController.uploadPdf
);
adminRouter.post(
  "/:id/image",
  uploadLimiter,
  validateParams(noticeIdParamSchema),
  runSingleNoticeImageUpload("image"),
  noticesController.uploadImage
);
adminRouter.delete("/:id/pdf", validateParams(noticeIdParamSchema), noticesController.removePdf);
adminRouter.delete("/:id/image", validateParams(noticeIdParamSchema), noticesController.removeImage);

export { publicRouter as noticesPublicRoutes, adminRouter as noticesAdminRoutes };
