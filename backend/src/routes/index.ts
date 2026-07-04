import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import { noticesPublicRoutes, noticesAdminRoutes } from "../modules/notices/notices.routes";
import { contactsPublicRoutes, contactsAdminRoutes } from "../modules/contacts/contacts.routes";
import { admissionsPublicRoutes, admissionsAdminRoutes } from "../modules/admissions/admissions.routes";
import { galleryPublicRoutes, galleryAdminRoutes } from "../modules/gallery/gallery.routes";
import { staffPublicRoutes, staffAdminRoutes } from "../modules/staff/staff.routes";
import { facultyPublicRoutes, facultyAdminRoutes } from "../modules/faculty/faculty.routes";
import { categoriesPublicRoutes, categoriesAdminRoutes } from "../modules/categories/categories.routes";
import { programsPublicRoutes, programsAdminRoutes } from "../modules/programs/programs.routes";
import { blogsPublicRoutes, blogsAdminRoutes } from "../modules/blogs/blogs.routes";
import { journalsPublicRoutes, journalsAdminRoutes } from "../modules/journals/journals.routes";
import { facilitiesPublicRoutes, facilitiesAdminRoutes } from "../modules/facilities/facilities.routes";
import { unitsPublicRoutes, unitsAdminRoutes } from "../modules/units/units.routes";
import { notificationsAdminRoutes } from "../modules/notifications/notifications.routes";
import examResultAdminRoutes from "../modules/examResult/examResult.admin.routes";
import examResultPublicRoutes from "../modules/examResult/examResult.public.routes";
import { sendSuccess } from "../utils/apiResponse";

const router = Router();

router.get("/health", (_req, res) => {
  sendSuccess(res, { status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/notices", noticesPublicRoutes);
router.use("/contacts", contactsPublicRoutes);
router.use("/admissions", admissionsPublicRoutes);
router.use("/gallery", galleryPublicRoutes);
router.use("/staff", staffPublicRoutes);
router.use("/faculty", facultyPublicRoutes);
router.use("/categories", categoriesPublicRoutes);
router.use("/programs", programsPublicRoutes);
router.use("/blogs", blogsPublicRoutes);
router.use("/journals", journalsPublicRoutes);
router.use("/facilities", facilitiesPublicRoutes);
router.use("/units", unitsPublicRoutes);

router.use("/admin/notices", noticesAdminRoutes);
router.use("/admin/contacts", contactsAdminRoutes);
router.use("/admin/admissions", admissionsAdminRoutes);
router.use("/admin/gallery", galleryAdminRoutes);
router.use("/admin/staff", staffAdminRoutes);
router.use("/admin/faculty", facultyAdminRoutes);
router.use("/admin/categories", categoriesAdminRoutes);
router.use("/admin/programs", programsAdminRoutes);
router.use("/admin/blogs", blogsAdminRoutes);
router.use("/admin/journals", journalsAdminRoutes);
router.use("/admin/facilities", facilitiesAdminRoutes);
router.use("/admin/units", unitsAdminRoutes);
router.use("/admin/notifications", notificationsAdminRoutes);
router.use("/admin/results", examResultAdminRoutes);
router.use("/results", examResultPublicRoutes);

export default router;
