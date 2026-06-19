import { Router } from "express";
import * as admissionsController from "./admissions.controller";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate";
import {
  admissionIdParamSchema,
  admissionSchema,
  exportAdmissionsQuerySchema,
  listAdmissionsQuerySchema,
  updateAdmissionSchema,
  updateAdmissionStatusSchema,
} from "./admissions.schema";
import { admissionLimiter } from "../../middleware/rateLimiter";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";
import { requireAdmissionAccess } from "../../middleware/admissionAccess";

const publicRouter = Router();

publicRouter.post("/", admissionLimiter, validateBody(admissionSchema), admissionsController.submit);
publicRouter.get(
  "/:id",
  admissionLimiter,
  validateParams(admissionIdParamSchema),
  requireAdmissionAccess,
  admissionsController.getOwn
);
publicRouter.patch(
  "/:id",
  admissionLimiter,
  validateParams(admissionIdParamSchema),
  requireAdmissionAccess,
  validateBody(updateAdmissionSchema),
  admissionsController.updateOwn
);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", validateQuery(listAdmissionsQuerySchema), admissionsController.listAdmin);
adminRouter.get("/export", validateQuery(exportAdmissionsQuerySchema), admissionsController.exportCsv);
adminRouter.get("/:id", validateParams(admissionIdParamSchema), admissionsController.getAdmin);
adminRouter.patch(
  "/:id/status",
  validateParams(admissionIdParamSchema),
  validateBody(updateAdmissionStatusSchema),
  admissionsController.updateStatus
);

export { publicRouter as admissionsPublicRoutes, adminRouter as admissionsAdminRoutes };
