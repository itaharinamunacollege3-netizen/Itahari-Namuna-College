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
