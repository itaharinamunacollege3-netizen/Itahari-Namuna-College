import { Router } from "express";
import * as notificationsController from "./notifications.controller";
import { validateParams, validateQuery } from "../../middleware/validate";
import {
  listNotificationsQuerySchema,
  notificationIdParamSchema,
} from "./notifications.schema";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);

adminRouter.get("/", validateQuery(listNotificationsQuerySchema), notificationsController.list);
adminRouter.get("/unread-count", notificationsController.unreadCount);
adminRouter.patch("/read-all", notificationsController.markAllRead);
adminRouter.patch(
  "/:id/read",
  validateParams(notificationIdParamSchema),
  notificationsController.markRead
);
adminRouter.delete(
  "/:id",
  validateParams(notificationIdParamSchema),
  notificationsController.remove
);

export { adminRouter as notificationsAdminRoutes };
