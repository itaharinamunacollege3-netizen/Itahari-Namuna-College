import { Router } from "express";
import * as contactsController from "./contacts.controller";
import { validateBody } from "../../middleware/validate";
import { contactSchema } from "./contacts.schema";
import { contactLimiter } from "../../middleware/rateLimiter";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";

const publicRouter = Router();
publicRouter.post("/", contactLimiter, validateBody(contactSchema), contactsController.submit);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", contactsController.listAdmin);
adminRouter.patch("/:id/read", contactsController.markRead);

export { publicRouter as contactsPublicRoutes, adminRouter as contactsAdminRoutes };
