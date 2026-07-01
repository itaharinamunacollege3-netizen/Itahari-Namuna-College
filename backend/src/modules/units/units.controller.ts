import { Request, Response, NextFunction } from "express";
import * as unitsService from "./units.service";
import { sendSuccess, AppError } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";
import { getUnitUploadFiles, getUploadedFile } from "../../middleware/upload";
import { listUnitsQuerySchema } from "./units.schema";
import { z } from "zod";

type ListQuery = z.infer<typeof listUnitsQuerySchema>;

function getListQuery(req: Request): ListQuery {
  return (req.validatedQuery ?? {}) as ListQuery;
}

export async function listPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getListQuery(req);
    const result = await unitsService.listUnits({
      page: query.page,
      limit: query.limit,
      categoryId: query.categoryId,
      publishedOnly: true,
    });
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getFeatured(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await unitsService.getFeaturedUnit();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await unitsService.listUnitCategories();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const idOrSlug = String(req.params.id);
    const data = await unitsService.getUnitByIdentifier(idOrSlug, true);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getListQuery(req);
    const result = await unitsService.listUnits({
      page: query.page,
      limit: query.limit,
      categoryId: query.categoryId,
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
    const data = await unitsService.getUnitById(id, false);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const files = getUnitUploadFiles(req);
    const data = await unitsService.createUnit(req.body, files);
    await writeAuditLog({
      userId: req.user?.id,
      action: "CREATE_UNIT",
      resource: "units",
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
    const files = getUnitUploadFiles(req);
    const data = await unitsService.updateUnit(id, req.body, files);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_UNIT",
      resource: "units",
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
    await unitsService.deleteUnit(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_UNIT",
      resource: "units",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Unit deleted" });
  } catch (err) {
    next(err);
  }
}

export async function uploadIcon(req: Request, res: Response, next: NextFunction) {
  try {
    const file = getUploadedFile(req, "icon");
    if (!file) throw new AppError(400, "Icon file is required");

    const id = Number(req.params.id);
    const data = await unitsService.uploadUnitIconFile(id, file);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPLOAD_UNIT_ICON",
      resource: "units",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function removeIcon(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await unitsService.removeUnitIcon(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_UNIT_ICON",
      resource: "units",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}
