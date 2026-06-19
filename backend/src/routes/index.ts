import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import { noticesPublicRoutes, noticesAdminRoutes } from "../modules/notices/notices.routes";
import { contactsPublicRoutes, contactsAdminRoutes } from "../modules/contacts/contacts.routes";
import { admissionsPublicRoutes, admissionsAdminRoutes } from "../modules/admissions/admissions.routes";
import { staffPublicRoutes, staffAdminRoutes } from "../modules/staff/staff.routes";
import { facultyPublicRoutes, facultyAdminRoutes } from "../modules/faculty/faculty.routes";
import { categoriesPublicRoutes, categoriesAdminRoutes } from "../modules/categories/categories.routes";
import { sendSuccess } from "../utils/apiResponse";

const router = Router();

router.get("/health", (_req, res) => {
  sendSuccess(res, { status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/notices", noticesPublicRoutes);
router.use("/contacts", contactsPublicRoutes);
router.use("/admissions", admissionsPublicRoutes);
router.use("/staff", staffPublicRoutes);
router.use("/faculty", facultyPublicRoutes);
router.use("/categories", categoriesPublicRoutes);

router.use("/admin/notices", noticesAdminRoutes);
router.use("/admin/contacts", contactsAdminRoutes);
router.use("/admin/admissions", admissionsAdminRoutes);
router.use("/admin/staff", staffAdminRoutes);
router.use("/admin/faculty", facultyAdminRoutes);
router.use("/admin/categories", categoriesAdminRoutes);

export default router;
