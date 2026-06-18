import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/apiResponse";
import { env } from "../config/env";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: env.isProduction ? "Internal server error" : err instanceof Error ? err.message : "Internal server error",
  });
}
