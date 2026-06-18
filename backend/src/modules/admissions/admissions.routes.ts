import { Router } from "express";
import * as admissionsController from "./admissions.controller";
import { validateBody } from "../../middleware/validate";
import { admissionSchema } from "./admissions.schema";
import { admissionLimiter } from "../../middleware/rateLimiter";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";

const publicRouter = Router();
publicRouter.post("/", admissionLimiter, validateBody(admissionSchema), admissionsController.submit);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", admissionsController.listAdmin);
adminRouter.patch("/:id/status", admissionsController.updateStatus);

export { publicRouter as admissionsPublicRoutes, adminRouter as admissionsAdminRoutes };
