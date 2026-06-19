import { Request, Response, NextFunction } from "express";
import * as programsService from "./programs.service";
import { sendSuccess, AppError } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";
import { getUploadedFile } from "../../middleware/upload";
import {
  listProgramsQuerySchema,
  publicListProgramsQuerySchema,
} from "./programs.schema";
import { z } from "zod";

type AdminListQuery = z.infer<typeof listProgramsQuerySchema>;
type PublicListQuery = z.infer<typeof publicListProgramsQuerySchema>;

function getAdminListQuery(req: Request): AdminListQuery {
  return (req.validatedQuery ?? {}) as AdminListQuery;
}

function getPublicListQuery(req: Request): PublicListQuery {
  return (req.validatedQuery ?? {}) as PublicListQuery;
}

export async function listPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getPublicListQuery(req);
    const featured = query.featured === "true" ? true : query.featured === "false" ? false : undefined;
    const programs = await programsService.listProgramsPublic(featured);
    sendSuccess(res, { programs });
  } catch (err) {
    next(err);
  }
}

export async function getBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await programsService.getProgramBySlug(req.params.slug as string);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getAdminListQuery(req);
    const result = await programsService.listProgramsAdmin({
      page: query.page,
      limit: query.limit,
      search: query.search,
      featured: query.featured === "true" ? true : query.featured === "false" ? false : undefined,
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
    const data = await programsService.getProgramAdminById(id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await programsService.createProgram(req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: "CREATE_PROGRAM",
      resource: "programs",
      resourceId: data.dbId,
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
    const data = await programsService.updateProgram(id, req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_PROGRAM",
      resource: "programs",
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
    await programsService.deleteProgram(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_PROGRAM",
      resource: "programs",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Program deleted" });
  } catch (err) {
    next(err);
  }
}

export async function reorder(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await programsService.reorderPrograms(req.body.items);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function uploadCover(req: Request, res: Response, next: NextFunction) {
  try {
    const file = getUploadedFile(req, "image");
    if (!file) throw new AppError(400, "Image file is required");

    const id = Number(req.params.id);
    const data = await programsService.uploadProgramCover(id, file);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPLOAD_PROGRAM_COVER",
      resource: "programs",
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
    const data = await programsService.removeProgramCover(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_PROGRAM_COVER",
      resource: "programs",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}
