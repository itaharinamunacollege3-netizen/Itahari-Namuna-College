import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/apiResponse";
import { env } from "../config/env";
import multer from "multer";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) { // handle the error
  if (err instanceof AppError) { // if the error is an AppError, return the error
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // Multer file-upload errors (file too large, invalid type, etc.)
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large. Maximum size is 5 MB."
        : err.code === "LIMIT_FILE_COUNT"
          ? "Too many files. Only 1 file is allowed."
          : err.message;
    return res.status(400).json({ success: false, message });
  }

  console.error(err); // log the error
  return res.status(500).json({ // return the error
    success: false,
    message: env.isProduction ? "Internal server error" : err instanceof Error ? err.message : "Internal server error",
  }); // return the error
}
