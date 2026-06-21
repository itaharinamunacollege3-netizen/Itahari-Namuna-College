import { Request, Response, NextFunction } from "express";
import * as notificationsService from "./notifications.service";
import { sendSuccess } from "../../utils/apiResponse";
import { listNotificationsQuerySchema } from "./notifications.schema";
import { z } from "zod";

type ListQuery = z.infer<typeof listNotificationsQuerySchema>;

function getListQuery(req: Request): ListQuery {
  return (req.validatedQuery ?? {}) as ListQuery;
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const query = getListQuery(req);
    const result = await notificationsService.listNotifications(req.user!.id, {
      page: query.page,
      limit: query.limit,
      unreadOnly: query.unreadOnly === "true",
    });
    sendSuccess(res, result.items, { ...result.meta, unreadCount: result.unreadCount });
  } catch (err) {
    next(err);
  }
}

export async function unreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const count = await notificationsService.getUnreadCount(req.user!.id);
    sendSuccess(res, { count });
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await notificationsService.markNotificationRead(
      req.user!.id,
      Number(req.params.id)
    );
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function markAllRead(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await notificationsService.markAllNotificationsRead(req.user!.id);
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await notificationsService.deleteNotification(
      req.user!.id,
      Number(req.params.id)
    );
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}
