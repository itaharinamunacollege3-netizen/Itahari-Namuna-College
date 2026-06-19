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

const publicRouter = Router();

publicRouter.get("/", validateQuery(listNoticesQuerySchema), noticesController.listPublic);
publicRouter.get("/featured", noticesController.getFeatured);
publicRouter.get("/:id", validateParams(noticeIdParamSchema), noticesController.getById);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", validateQuery(listNoticesQuerySchema), noticesController.listAdmin);
adminRouter.post("/", validateBody(createNoticeSchema), noticesController.create);
adminRouter.patch("/:id", validateBody(updateNoticeSchema), noticesController.update);
adminRouter.delete("/:id", noticesController.remove);

export { publicRouter as noticesPublicRoutes, adminRouter as noticesAdminRoutes };
