import { Router } from "express";
import * as categoryController from "./categories.controller";
import { validateBody } from "../../middleware/validate";
import {
  createStaffCategorySchema,
  updateStaffCategorySchema,
  createFacultyDepartmentSchema,
  updateFacultyDepartmentSchema,
} from "./categories.schema";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";

// ── Public routes (read-only, for populating dropdowns/filters on frontend) ──
const publicRouter = Router();
publicRouter.get("/staff-categories", categoryController.listStaffCategories);
publicRouter.get("/staff-categories/:id", categoryController.getStaffCategory);
publicRouter.get("/faculty-departments", categoryController.listFacultyDepartments);
publicRouter.get("/faculty-departments/:id", categoryController.getFacultyDepartment);

// ── Admin routes (full CRUD, requires access token + admin role) ──
const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);

// Staff categories
adminRouter.get("/staff-categories", categoryController.listAllStaffCategories);
adminRouter.post(
  "/staff-categories",
  validateBody(createStaffCategorySchema),
  categoryController.createStaffCategory
);
adminRouter.patch(
  "/staff-categories/:id",
  validateBody(updateStaffCategorySchema),
  categoryController.updateStaffCategory
);
adminRouter.delete("/staff-categories/:id", categoryController.deleteStaffCategory);

// Faculty departments
adminRouter.get("/faculty-departments", categoryController.listAllFacultyDepartments);
adminRouter.post(
  "/faculty-departments",
  validateBody(createFacultyDepartmentSchema),
  categoryController.createFacultyDepartment
);
adminRouter.patch(
  "/faculty-departments/:id",
  validateBody(updateFacultyDepartmentSchema),
  categoryController.updateFacultyDepartment
);
adminRouter.delete("/faculty-departments/:id", categoryController.deleteFacultyDepartment);

export { publicRouter as categoriesPublicRoutes, adminRouter as categoriesAdminRoutes };
