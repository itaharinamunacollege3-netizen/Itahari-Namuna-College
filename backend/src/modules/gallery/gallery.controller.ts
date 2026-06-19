import { Request, Response, NextFunction } from "express";
import * as galleryService from "./gallery.service";
import { sendSuccess, AppError } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";
import { adminListGalleryQuerySchema } from "./gallery.schema";
import { z } from "zod";

type AdminListQuery = z.infer<typeof adminListGalleryQuerySchema>;

function getAdminListQuery(req: Request): AdminListQuery {
  return (req.validatedQuery ?? {}) as AdminListQuery;
}

export async function listPublic(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await galleryService.listPublicAlbums();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listFeatured(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await galleryService.listFeaturedAlbums();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await galleryService.getPublicAlbumBySlug(req.params.slug as string);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getAdminListQuery(req);
    const result = await galleryService.listAdminAlbums(query);
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await galleryService.getAdminAlbum(Number(req.params.id));
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await galleryService.createAlbum(req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: "CREATE_GALLERY_ALBUM",
      resource: "gallery",
      resourceId: data.id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data, undefined, 201);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await galleryService.updateAlbum(id, req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_GALLERY_ALBUM",
      resource: "gallery",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await galleryService.deleteAlbum(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_GALLERY_ALBUM",
      resource: "gallery",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Gallery album deleted" });
  } catch (err) {
    next(err);
  }
}

export async function uploadCover(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new AppError(400, "Cover image file is required");

    const id = Number(req.params.id);
    const data = await galleryService.uploadAlbumCover(id, req.file);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPLOAD_GALLERY_COVER",
      resource: "gallery",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function uploadImages(req: Request, res: Response, next: NextFunction) {
  try {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const id = Number(req.params.id);
    const data = await galleryService.uploadAlbumImages(id, files);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPLOAD_GALLERY_IMAGES",
      resource: "gallery",
      resourceId: id,
      metadata: { count: files.length },
      ipAddress: req.ip,
    });
    sendSuccess(res, data, undefined, 201);
  } catch (err) {
    next(err);
  }
}

export async function deleteImage(req: Request, res: Response, next: NextFunction) {
  try {
    const albumId = Number(req.params.id);
    const imageId = Number(req.params.imageId);
    await galleryService.deleteAlbumImage(albumId, imageId);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_GALLERY_IMAGE",
      resource: "gallery",
      resourceId: albumId,
      metadata: { imageId },
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Gallery image deleted" });
  } catch (err) {
    next(err);
  }
}

export async function reorderImages(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await galleryService.reorderAlbumImages(id, req.body);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function updateImageCaption(req: Request, res: Response, next: NextFunction) {
  try {
    const albumId = Number(req.params.id);
    const imageId = Number(req.params.imageId);
    const data = await galleryService.updateImageCaption(albumId, imageId, req.body);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}
