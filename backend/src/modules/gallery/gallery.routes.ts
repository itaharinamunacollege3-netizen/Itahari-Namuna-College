import { Router } from "express";
import * as galleryController from "./gallery.controller";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate";
import {
  adminListGalleryQuerySchema,
  albumIdParamSchema,
  albumSlugParamSchema,
  createAlbumSchema,
  imageIdParamSchema,
  reorderImagesSchema,
  updateAlbumSchema,
  updateImageCaptionSchema,
} from "./gallery.schema";
import { authenticate } from "../../middleware/authenticate";
import { requireAdmin } from "../../middleware/adminGuard";
import { handleMulterError, runMultiImageUpload, runSingleImageUpload } from "../../middleware/upload";
import { uploadLimiter } from "../../middleware/rateLimiter";

const publicRouter = Router();

publicRouter.get("/", galleryController.listPublic);
publicRouter.get("/featured", galleryController.listFeatured);
publicRouter.get("/:slug", validateParams(albumSlugParamSchema), galleryController.getBySlug);

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);

adminRouter.get("/", validateQuery(adminListGalleryQuerySchema), galleryController.listAdmin);
adminRouter.get("/:id", validateParams(albumIdParamSchema), galleryController.getAdmin);
adminRouter.post("/", validateBody(createAlbumSchema), galleryController.create);
adminRouter.patch("/:id", validateParams(albumIdParamSchema), validateBody(updateAlbumSchema), galleryController.update);
adminRouter.delete("/:id", validateParams(albumIdParamSchema), galleryController.remove);

adminRouter.post(
  "/:id/cover",
  uploadLimiter,
  validateParams(albumIdParamSchema),
  runSingleImageUpload("cover"),
  galleryController.uploadCover
);

adminRouter.post(
  "/:id/images",
  uploadLimiter,
  validateParams(albumIdParamSchema),
  runMultiImageUpload("images", 20),
  galleryController.uploadImages
);

adminRouter.delete(
  "/:id/images/:imageId",
  validateParams(imageIdParamSchema),
  galleryController.deleteImage
);

adminRouter.patch(
  "/:id/images/reorder",
  validateParams(albumIdParamSchema),
  validateBody(reorderImagesSchema),
  galleryController.reorderImages
);

adminRouter.patch(
  "/:id/images/:imageId",
  validateParams(imageIdParamSchema),
  validateBody(updateImageCaptionSchema),
  galleryController.updateImageCaption
);

export { publicRouter as galleryPublicRoutes, adminRouter as galleryAdminRoutes };
