import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/apiResponse";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) { // require admin access
  if (!req.user || req.user.role !== "admin") { // check if the user is an admin
    return next(new AppError(403, "Admin access required")); // if not, return an error
  }
  next();
}
