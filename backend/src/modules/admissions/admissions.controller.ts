import { Request, Response, NextFunction } from "express";
import * as admissionsService from "./admissions.service";
import { sendSuccess } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";
import {
  exportAdmissionsQuerySchema,
  listAdmissionsQuerySchema,
} from "./admissions.schema";
import { z } from "zod";

type ListQuery = z.infer<typeof listAdmissionsQuerySchema>;
type ExportQuery = z.infer<typeof exportAdmissionsQuerySchema>;

function getListQuery(req: Request): ListQuery {
  return (req.validatedQuery ?? {}) as ListQuery;
}

function getExportQuery(req: Request): ExportQuery {
  return (req.validatedQuery ?? {}) as ExportQuery;
}

export async function submit(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await admissionsService.createAdmission(req.body);
    sendSuccess(res, result, undefined, 201);
  } catch (err) {
    next(err);
  }
}

export async function getOwn(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await admissionsService.getApplicationById(Number(req.params.id));
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function updateOwn(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await admissionsService.updateApplicationByApplicant(
      Number(req.params.id),
      req.body
    );
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getListQuery(req);
    const result = await admissionsService.listAdmissions({
      page: query.page,
      limit: query.limit,
      status: query.status,
      program: query.program,
      search: query.search,
    });
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await admissionsService.getAdmissionForAdmin(Number(req.params.id));
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status, adminNotes } = req.body;
    const data = await admissionsService.updateAdmissionStatus(id, status, adminNotes);

    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_ADMISSION_STATUS",
      resource: "admissions",
      resourceId: id,
      metadata: { status, adminNotes },
      ipAddress: req.ip,
    });

    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function exportCsv(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getExportQuery(req);
    const csv = await admissionsService.exportAdmissionsCsv({
      status: query.status,
      program: query.program,
      search: query.search,
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="admissions-${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
}
