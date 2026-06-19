import multer, { MulterError } from "multer";
import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/apiResponse";
import { isAllowedImageMime } from "../utils/imageValidation";

const storage = multer.memoryStorage();

function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (!isAllowedImageMime(file.mimetype)) {
    return cb(new AppError(400, "Only JPEG, PNG, and WebP images are allowed"));
  }
  cb(null, true);
}

export const singleImageUpload = multer({
  storage,
  limits: { fileSize: env.maxUploadBytes, files: 1 },
  fileFilter: imageFileFilter,
});

export const multiImageUpload = multer({
  storage,
  limits: { fileSize: env.maxUploadBytes, files: 20 },
  fileFilter: imageFileFilter,
});

export function handleMulterError(err: unknown, _req: Request, _res: Response, next: NextFunction) {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new AppError(400, `Image must be under ${env.MAX_UPLOAD_SIZE_MB} MB`));
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return next(new AppError(400, "Too many files in one upload"));
    }
    return next(new AppError(400, err.message));
  }
  next(err);
}

export function runSingleImageUpload(fieldName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    singleImageUpload.single(fieldName)(req, res, (err) => {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  };
}

export function runMultiImageUpload(fieldName: string, maxCount: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    multiImageUpload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  };
}
