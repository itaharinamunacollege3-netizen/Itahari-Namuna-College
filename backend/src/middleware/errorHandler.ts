import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/apiResponse";
import { env } from "../config/env";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) { // handle the error
  if (err instanceof AppError) { // if the error is an AppError, return the error
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  console.error(err); // log the error
  return res.status(500).json({ // return the error
    success: false,
    message: env.isProduction ? "Internal server error" : err instanceof Error ? err.message : "Internal server error",
  }); // return the error
}
