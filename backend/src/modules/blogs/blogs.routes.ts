import { Router } from "express";
import * as blogsController from "./blogs.controller";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate";
import {
  blogIdParamSchema,
  createBlogSchema,
  listBlogsQuerySchema,
  updateBlogSchema,
} from "./blogs.schema";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";
import { runSingleImageUpload, runSinglePdfUpload, runBlogFileUpload } from "../../middleware/upload";
import { uploadLimiter } from "../../middleware/rateLimiter";
import { z } from "zod";

const adminBlogIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const publicRouter = Router();

publicRouter.get("/", validateQuery(listBlogsQuerySchema), blogsController.listPublic);
publicRouter.get("/featured", blogsController.getFeatured);
publicRouter.get("/popular", blogsController.getPopular);
publicRouter.get("/categories", blogsController.getCategories);
publicRouter.get("/:id/related", validateParams(blogIdParamSchema), blogsController.getRelated);
publicRouter.get("/:id", validateParams(blogIdParamSchema), blogsController.getById);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", validateQuery(listBlogsQuerySchema), blogsController.listAdmin);
adminRouter.get("/:id", validateParams(adminBlogIdParamSchema), blogsController.getAdminById);
adminRouter.post(
  "/",
  uploadLimiter,
  runBlogFileUpload(),
  validateBody(createBlogSchema),
  blogsController.create
);
adminRouter.patch(
  "/:id",
  uploadLimiter,
  validateParams(adminBlogIdParamSchema),
  runBlogFileUpload(),
  validateBody(updateBlogSchema),
  blogsController.update
);
adminRouter.delete("/:id", validateParams(adminBlogIdParamSchema), blogsController.remove);
adminRouter.post(
  "/:id/cover",
  uploadLimiter,
  validateParams(adminBlogIdParamSchema),
  runSingleImageUpload("cover"),
  blogsController.uploadCover
);
adminRouter.delete("/:id/cover", validateParams(adminBlogIdParamSchema), blogsController.removeCover);
adminRouter.post(
  "/:id/attachment",
  uploadLimiter,
  validateParams(adminBlogIdParamSchema),
  runSinglePdfUpload("attachment"),
  blogsController.uploadAttachment
);
adminRouter.delete("/:id/attachment", validateParams(adminBlogIdParamSchema), blogsController.removeAttachment);

export { publicRouter as blogsPublicRoutes, adminRouter as blogsAdminRoutes };
