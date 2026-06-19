import multer, { FileFilterCallback, StorageEngine } from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";
import { AppError } from "../utils/apiResponse";

const UPLOAD_BASE = path.resolve(process.cwd(), "uploads");

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function buildStorage(subDir: string): StorageEngine {
  const dest = path.join(UPLOAD_BASE, subDir);
  ensureDir(dest);

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      cb(null, `${unique}${ext}`);
    },
  });
}

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new AppError(400, "Only JPEG, PNG, and WebP images are allowed")
    );
  }
  cb(null, true);
}

/**
 * Creates a multer uploader configured for a specific sub-directory.
 * Usage: `upload("staff").single("photo")`
 */
export function upload(subDir: string) {
  return multer({
    storage: buildStorage(subDir),
    fileFilter,
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1,
    },
  });
}

/**
 * Returns the public URL path for an uploaded file.
 * e.g. `/uploads/staff/1718000000-123456.jpg`
 */
export function photoUrl(filename: string, subDir: string): string {
  return `/uploads/${subDir}/${filename}`;
}

/**
 * Deletes a previously uploaded photo file from disk.
 * Safe to call with null/undefined — it simply no-ops.
 */
export function deletePhoto(photoPath: string | null | undefined): void {
  if (!photoPath) return;
  const fullPath = path.join(process.cwd(), photoPath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}
