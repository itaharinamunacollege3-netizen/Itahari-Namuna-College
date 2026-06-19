import { Request, Response, NextFunction } from "express";
import * as noticesService from "./notices.service";
import { sendSuccess } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";
import { listNoticesQuerySchema } from "./notices.schema";
import { z } from "zod";

type ListQuery = z.infer<typeof listNoticesQuerySchema>;

function getListQuery(req: Request): ListQuery {
  return (req.validatedQuery ?? {}) as ListQuery;
}

export async function listPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getListQuery(req);
    const result = await noticesService.listNotices({
      page: query.page,
      limit: query.limit,
      search: query.search,
      tag: query.tag,
      publishedOnly: true,
    });
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await noticesService.getNoticeById(id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getFeatured(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await noticesService.getFeaturedNotice();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getListQuery(req);
    const result = await noticesService.listNotices({
      page: query.page,
      limit: query.limit,
      search: query.search,
      tag: query.tag,
      publishedOnly: false,
    });
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await noticesService.createNotice(req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: "CREATE_NOTICE",
      resource: "notices",
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
    const data = await noticesService.updateNotice(id, req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: "UPDATE_NOTICE",
      resource: "notices",
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
    await noticesService.deleteNotice(id);
    await writeAuditLog({
      userId: req.user?.id,
      action: "DELETE_NOTICE",
      resource: "notices",
      resourceId: id,
      ipAddress: req.ip,
    });
    sendSuccess(res, { message: "Notice deleted" });
  } catch (err) {
    next(err);
  }
}
