import { Request, Response, NextFunction } from "express";
import * as journalsService from "./journals.service";
import { sendSuccess, AppError } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";
import { getJournalUploadFiles, getUploadedFile } from "../../middleware/upload";
import { listJournalsQuerySchema } from "./journals.schema";
import { z } from "zod";

type ListQuery = z.infer<typeof listJournalsQuerySchema>;

function getListQuery(req: Request): ListQuery {
  return (req.validatedQuery ?? {}) as ListQuery;
}

export async function listPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getListQuery(req);
    const result = await journalsService.listJournals({
      page: query.page,
      limit: query.limit,
      search: query.search,
      field: query.field,
      keyword: query.keyword,
      publishedOnly: true,
    });
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getFeatured(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await journalsService.getFeaturedJournal();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getPopular(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Math.min(Number(req.query.limit) || 4, 10);
    const data = await journalsService.getPopularJournals(limit);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getFields(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await journalsService.listJournalFields();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const idOrSlug = String(req.params.id);
    const data = await journalsService.getJournalByIdentifier(idOrSlug, true);
    void journalsService.incrementJournalViewCount(idOrSlug);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getRelated(req: Request, res: Response, next: NextFunction) {
  try {
    const idOrSlug = String(req.params.id);
    const entry = await journalsService.getJournalByIdentifier(idOrSlug, true);
    const data = await journalsService.getRelatedJournals(entry.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getListQuery(req);
    const result = await journalsService.listJournals({
      page: query.page,
      limit: query.limit,
      search: query.search,
      field: query.field,
      keyword: query.keyword,
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
    const data = await journalsService.getJournalById(id, false);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const files = getJournalUploadFiles(req);
    const data = await journalsService.createJournal(req.body, files);
    await writeAuditLog({
      userId: req.user?.id,
      action: "CREATE_JOURNAL",
      resource: "journals",
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
    const files = getJournalUploadFiles(req);
    const data = await journalsService.updateJournal(id, req.body, files);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_JOURNAL",
      resource: "journals",
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
    await journalsService.deleteJournal(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_JOURNAL",
      resource: "journals",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Journal entry deleted" });
  } catch (err) {
    next(err);
  }
}

export async function uploadCover(req: Request, res: Response, next: NextFunction) {
  try {
    const file = getUploadedFile(req, "cover");
    if (!file) throw new AppError(400, "Cover image file is required");

    const id = Number(req.params.id);
    const data = await journalsService.uploadJournalCoverAttachment(id, file);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPLOAD_JOURNAL_COVER",
      resource: "journals",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function uploadPdf(req: Request, res: Response, next: NextFunction) {
  try {
    const file = getUploadedFile(req, "pdf");
    if (!file) throw new AppError(400, "PDF file is required");

    const id = Number(req.params.id);
    const data = await journalsService.uploadJournalPdfAttachment(id, file);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPLOAD_JOURNAL_PDF",
      resource: "journals",
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
    const data = await journalsService.removeJournalCoverAttachment(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_JOURNAL_COVER",
      resource: "journals",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function removePdf(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await journalsService.removeJournalPdfAttachment(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_JOURNAL_PDF",
      resource: "journals",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}
