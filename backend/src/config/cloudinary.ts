import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";
import { AppError } from "../utils/apiResponse";

export function assertCloudinaryConfigured() {
  if (!env.cloudinaryConfigured) {
    throw new AppError(
      503,
      "Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }
}

export function getCloudinary() {
  assertCloudinaryConfigured();
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

/** Map Cloudinary SDK errors to actionable API responses. */
export function rethrowCloudinaryError(err: unknown): never {
  if (err && typeof err === "object" && "http_code" in err) {
    const cloudinaryErr = err as { message?: string; http_code?: number; error?: { message?: string } };
    const detail = cloudinaryErr.error?.message ?? cloudinaryErr.message ?? "Cloudinary request failed";

    if (cloudinaryErr.http_code === 401) {
      throw new AppError(
        503,
        `Cloudinary credentials are invalid. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env. (${detail})`
      );
    }

    if (cloudinaryErr.http_code === 403) {
      throw new AppError(
        503,
        "Cloudinary upload is forbidden. Your API key is missing upload permissions. In Cloudinary Console go to Settings → Security → Access Keys, create or edit a key with Upload (create) permission enabled, then update CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in backend/.env and restart the server."
      );
    }

    throw new AppError(502, `Cloudinary request failed: ${detail}`);
  }

  throw err;
}
