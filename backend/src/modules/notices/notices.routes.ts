import { Router } from "express";
import * as noticesController from "./notices.controller";
import { validateBody, validateQuery } from "../../middleware/validate";
import {
  createNoticeSchema,
  latestNoticesQuerySchema,
  listNoticesQuerySchema,
  updateNoticeSchema,
} from "./notices.schema";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";

const publicRouter = Router();
publicRouter.get("/", validateQuery(listNoticesQuerySchema), noticesController.listPublic);
publicRouter.get("/latest", validateQuery(latestNoticesQuerySchema), noticesController.latest);
publicRouter.get("/:slug", noticesController.getBySlug);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", validateQuery(listNoticesQuerySchema), noticesController.listAdmin);
adminRouter.post("/", validateBody(createNoticeSchema), noticesController.create);
adminRouter.patch("/:id", validateBody(updateNoticeSchema), noticesController.update);
adminRouter.delete("/:id", noticesController.remove);

export { publicRouter as noticesPublicRoutes, adminRouter as noticesAdminRoutes };
