import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/apiResponse";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError(403, "Admin access required"));
  }
  next();
}
