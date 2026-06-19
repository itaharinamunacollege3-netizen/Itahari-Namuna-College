import { getCloudinary, rethrowCloudinaryError } from "../config/cloudinary";
import { env } from "../config/env";
import { AppError } from "../utils/apiResponse";
import {
  sanitizeUploadFilename,
  validateImageBuffer,
  validatePdfBuffer,
} from "../utils/imageValidation";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  bytes?: number;
}

function albumFolder(albumSlug: string) {
  return `${env.CLOUDINARY_FOLDER}/${albumSlug}`;
}

function noticeFolder(noticeSlug: string) {
  return `${env.CLOUDINARY_FOLDER}/notices/${noticeSlug}`;
}

/** Resize, convert to WebP, and compress before storage (values from .env). */
function galleryUploadOptions() {
  return {
    format: "webp" as const,
    transformation: [
      { width: env.CLOUDINARY_MAX_IMAGE_WIDTH, crop: "limit" as const },
      { quality: env.CLOUDINARY_WEBP_QUALITY },
    ],
  };
}

async function withCloudinary<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    rethrowCloudinaryError(err);
  }
}

export async function uploadGalleryImage(
  file: Express.Multer.File,
  albumSlug: string
): Promise<CloudinaryUploadResult> {
  if (!validateImageBuffer(file.buffer, file.mimetype)) {
    throw new AppError(400, "File content does not match an allowed image format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: albumFolder(albumSlug),
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
        ...galleryUploadOptions(),
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

export async function uploadGalleryImages(
  files: Express.Multer.File[],
  albumSlug: string
): Promise<CloudinaryUploadResult[]> {
  const uploads: CloudinaryUploadResult[] = [];

  for (const file of files) {
    uploads.push(await uploadGalleryImage(file, albumSlug));
  }

  return uploads;
}

export async function deleteCloudinaryImage(publicId: string | null | undefined) {
  await deleteCloudinaryAsset(publicId, "image");
}

export async function deleteCloudinaryImages(publicIds: (string | null | undefined)[]) {
  await Promise.all(publicIds.map((id) => deleteCloudinaryImage(id)));
}

export async function deleteCloudinaryAsset(
  publicId: string | null | undefined,
  resourceType: "image" | "raw" = "image"
) {
  if (!publicId) return;

  const cloudinary = getCloudinary();
  await withCloudinary(() =>
    cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  );
}

export async function uploadNoticePdf(
  file: Express.Multer.File,
  noticeSlug: string
): Promise<CloudinaryUploadResult> {
  if (file.mimetype !== "application/pdf") {
    throw new AppError(400, "Only PDF files are allowed");
  }
  if (!validatePdfBuffer(file.buffer)) {
    throw new AppError(400, "File content does not match an allowed PDF format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:application/pdf;base64,${file.buffer.toString("base64")}`,
      {
        folder: noticeFolder(noticeSlug),
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "raw",
        overwrite: false,
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
  };
}

export async function uploadNoticeImage(
  file: Express.Multer.File,
  noticeSlug: string
): Promise<CloudinaryUploadResult> {
  if (!validateImageBuffer(file.buffer, file.mimetype)) {
    throw new AppError(400, "File content does not match an allowed image format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await withCloudinary(() =>
    cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: noticeFolder(noticeSlug),
        public_id: `${safeName}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
        format: "webp",
        transformation: [
          { width: env.CLOUDINARY_MAX_IMAGE_WIDTH, crop: "limit" },
          { quality: env.CLOUDINARY_WEBP_QUALITY },
        ],
      }
    )
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}
