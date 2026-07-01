import { Request, Response, NextFunction } from "express";
import * as facilitiesService from "./facilities.service";
import { sendSuccess, AppError } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";
import { getFacilityUploadFiles, getUploadedFile } from "../../middleware/upload";
import { listFacilitiesQuerySchema } from "./facilities.schema";
import { z } from "zod";

type ListQuery = z.infer<typeof listFacilitiesQuerySchema>;

function getListQuery(req: Request): ListQuery {
  return (req.validatedQuery ?? {}) as ListQuery;
}

export async function listPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getListQuery(req);
    const result = await facilitiesService.listFacilities({
      page: query.page,
      limit: query.limit,
      category: query.category,
      publishedOnly: true,
    });
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getFeatured(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await facilitiesService.getFeaturedFacility();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await facilitiesService.listFacilityCategories();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const idOrSlug = String(req.params.id);
    const data = await facilitiesService.getFacilityByIdentifier(idOrSlug, true);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getListQuery(req);
    const result = await facilitiesService.listFacilities({
      page: query.page,
      limit: query.limit,
      category: query.category,
      publishedOnly: false,
    });
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getAdminById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await facilitiesService.getFacilityById(id, false);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const files = getFacilityUploadFiles(req);
    const data = await facilitiesService.createFacility(req.body, files);
    await writeAuditLog({
      userId: req.user?.id,
      action: "CREATE_FACILITY",
      resource: "facilities",
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
    const files = getFacilityUploadFiles(req);
    const data = await facilitiesService.updateFacility(id, req.body, files);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_FACILITY",
      resource: "facilities",
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
    await facilitiesService.deleteFacility(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_FACILITY",
      resource: "facilities",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Facility deleted" });
  } catch (err) {
    next(err);
  }
}

export async function uploadCover(req: Request, res: Response, next: NextFunction) {
  try {
    const file = getUploadedFile(req, "image");
    if (!file) throw new AppError(400, "Image file is required");

    const id = Number(req.params.id);
    const data = await facilitiesService.uploadFacilityCover(id, file);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPLOAD_FACILITY_IMAGE",
      resource: "facilities",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function removeCover(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await facilitiesService.removeFacilityCover(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_FACILITY_IMAGE",
      resource: "facilities",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}
