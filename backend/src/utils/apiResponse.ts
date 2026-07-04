import { Response } from "express";

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  unreadCount?: number;
}

export function sendSuccess<T>(res: Response, data: T, messageOrMeta?: string | ApiMeta, status: number = 200) {
  const meta = typeof messageOrMeta === 'object' ? messageOrMeta : undefined;
  const message = typeof messageOrMeta === 'string' ? messageOrMeta : undefined;

  return res.status(status).json({
    success: true,
    ...(message && { message }),
    data,
    ...(meta ? { meta } : {}),
  });
}

export function sendError(res: Response, message: string, status = 400) {
  return res.status(status).json({
    success: false,
    message,
  });
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}
