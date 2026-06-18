import { Request, Response, NextFunction } from "express";
import * as noticesService from "./notices.service";
import { sendSuccess } from "../../utils/apiResponse";
import { writeAuditLog } from "../../utils/audit";
import { latestNoticesQuerySchema, listNoticesQuerySchema } from "./notices.schema";
import { z } from "zod";

type ListQuery = z.infer<typeof listNoticesQuerySchema>;
type LatestQuery = z.infer<typeof latestNoticesQuerySchema>;

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
      category: query.category,
      tag: query.tag,
    });
    sendSuccess(res, result.items, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function latest(req: Request, res: Response, next: NextFunction) {
  try {
    const query = (req.validatedQuery ?? {}) as LatestQuery;
    const data = await noticesService.getLatestNotices({
      popup: query.popup === "true",
      marquee: query.marquee === "true",
    });
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await noticesService.getNoticeBySlug(req.params.slug as string);
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
      category: query.category,
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
