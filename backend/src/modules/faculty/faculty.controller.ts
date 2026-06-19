import { Request, Response, NextFunction } from "express";
import * as facultyService from "./faculty.service";
import { sendSuccess } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";
import { listFacultyQuerySchema, publicFacultyQuerySchema } from "./faculty.schema";
import { photoUrl } from "../../config/upload";
import { z } from "zod";

type ListQuery = z.infer<typeof listFacultyQuerySchema>;
type PublicQuery = z.infer<typeof publicFacultyQuerySchema>;

export async function listPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const query = (req.validatedQuery ?? {}) as PublicQuery;
    const data = await facultyService.listFacultyPublic(query.department);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await facultyService.getFacultyById(id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const query = (req.validatedQuery ?? {}) as ListQuery;
    const result = await facultyService.listFacultyAdmin({
      page: query.page,
      limit: query.limit,
      department: query.department,
      search: query.search,
    });
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const photo = req.file ? photoUrl(req.file.filename, "faculty") : undefined;
    const data = await facultyService.createFaculty({ ...req.body, photo });
    await writeAuditLog({
      userId: req.user?.id,
      action: "CREATE_FACULTY",
      resource: "faculty",
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
    const photo = req.file ? photoUrl(req.file.filename, "faculty") : undefined;
    const data = await facultyService.updateFaculty(id, { ...req.body, photo });
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_FACULTY",
      resource: "faculty",
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
    await facultyService.deleteFaculty(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_FACULTY",
      resource: "faculty",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Faculty member deleted" });
  } catch (err) {
    next(err);
  }
}
