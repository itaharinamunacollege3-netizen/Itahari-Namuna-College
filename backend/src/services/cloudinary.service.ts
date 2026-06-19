import { getCloudinary } from "../config/cloudinary";
import { env } from "../config/env";
import { AppError } from "../utils/apiResponse";
import { sanitizeUploadFilename, validateImageBuffer } from "../utils/imageValidation";

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

export async function uploadGalleryImage(
  file: Express.Multer.File,
  albumSlug: string
): Promise<CloudinaryUploadResult> {
  if (!validateImageBuffer(file.buffer, file.mimetype)) {
    throw new AppError(400, "File content does not match an allowed image format");
  }

  const cloudinary = getCloudinary();
  const safeName = sanitizeUploadFilename(file.originalname.replace(/\.[^.]+$/, ""));

  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    {
      folder: albumFolder(albumSlug),
      public_id: `${safeName}-${Date.now()}`,
      resource_type: "image",
      overwrite: false,
      invalidate: true,
      ...galleryUploadOptions(),
    }
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
  if (!publicId) return;

  const cloudinary = getCloudinary();
  await cloudinary.uploader.destroy(publicId, { invalidate: true });
}

export async function deleteCloudinaryImages(publicIds: (string | null | undefined)[]) {
  await Promise.all(publicIds.map((id) => deleteCloudinaryImage(id)));
}
