import { Request, Response, NextFunction } from "express";
import * as staffService from "./staff.service";
import { sendSuccess } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";
import { listStaffQuerySchema, publicStaffQuerySchema } from "./staff.schema";
import { photoUrl } from "../../config/upload";
import { z } from "zod";

type ListQuery = z.infer<typeof listStaffQuerySchema>;
type PublicQuery = z.infer<typeof publicStaffQuerySchema>;

export async function listPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const query = (req.validatedQuery ?? {}) as PublicQuery;
    const data = await staffService.listStaffPublic(query.category);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await staffService.getStaffById(id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const query = (req.validatedQuery ?? {}) as ListQuery;
    const result = await staffService.listStaffAdmin({
      page: query.page,
      limit: query.limit,
      category: query.category,
      search: query.search,
    });
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const photo = req.file ? photoUrl(req.file.filename, "staff") : undefined;
    const data = await staffService.createStaff({ ...req.body, photo });
    await writeAuditLog({
      userId: req.user?.id,
      action: "CREATE_STAFF",
      resource: "staff",
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
    const photo = req.file ? photoUrl(req.file.filename, "staff") : undefined;
    const data = await staffService.updateStaff(id, { ...req.body, photo });
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_STAFF",
      resource: "staff",
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
    await staffService.deleteStaff(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_STAFF",
      resource: "staff",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Staff member deleted" });
  } catch (err) {
    next(err);
  }
}
