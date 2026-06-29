import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:5173,http://localhost:5174,http://localhost:5175"),
  COOKIE_DOMAIN: z.string().default("localhost"),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  BCRYPT_ROUNDS: z.coerce.number().default(12),
  MAX_LOGIN_ATTEMPTS: z.coerce.number().default(5),
  LOCKOUT_DURATION_MINUTES: z.coerce.number().default(15),
  TRUST_PROXY: z.coerce.number().default(1),
  ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
  SEED_ADMIN_NAME: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  EXPOSE_AUTH_TOKENS_IN_BODY: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_FOLDER: z.string().default("inc-college/gallery"),
  /** Max incoming file size per image before Cloudinary WebP compression (MB). */
  MAX_UPLOAD_SIZE_MB: z.coerce.number().min(1).max(25).default(10),
  /** Max stored image width; height scales proportionally. */
  CLOUDINARY_MAX_IMAGE_WIDTH: z.coerce.number().min(640).max(4096).default(1920),
  /** WebP quality after compression (1–100; lower = smaller files). */
  CLOUDINARY_WEBP_QUALITY: z.coerce.number().min(40).max(100).default(75),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  isProduction: parsed.data.NODE_ENV === "production",
  exposeAuthTokensInBody:
    parsed.data.EXPOSE_AUTH_TOKENS_IN_BODY === true ||
    parsed.data.NODE_ENV !== "production",
  cloudinaryConfigured: Boolean(
    parsed.data.CLOUDINARY_CLOUD_NAME &&
      parsed.data.CLOUDINARY_API_KEY &&
      parsed.data.CLOUDINARY_API_SECRET
  ),
  maxUploadBytes: parsed.data.MAX_UPLOAD_SIZE_MB * 1024 * 1024,
};
