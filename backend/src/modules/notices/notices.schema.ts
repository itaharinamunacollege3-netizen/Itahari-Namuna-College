import { z } from "zod";

const bsDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "publishedDate must use YYYY-MM-DD format");

const pdfUrlSchema = z.string().url().optional().or(z.literal(""));

export const listNoticesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(100),
  search: z.string().optional(),
  tag: z.string().optional(),
});

export const noticeIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

function parseBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return fallback;
}

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((tag) => tag.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed)
          ? parsed.map(String).map((tag) => tag.trim()).filter(Boolean)
          : [];
      } catch {
        return trimmed.split(",").map((tag) => tag.trim()).filter(Boolean);
      }
    }
    return trimmed.split(",").map((tag) => tag.trim()).filter(Boolean);
  }
  return [];
}

const noticeFieldsSchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().min(1),
  publishedDate: bsDateSchema,
  category: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).default([]),
  audience: z.string().trim().optional(),
  author: z.string().trim().optional(),
  pdfUrl: pdfUrlSchema,
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  slug: z.string().trim().optional(),
  removePdf: z.boolean().default(false),
  removeImage: z.boolean().default(false),
});

function normalizeNoticeBody(body: unknown): unknown {
  if (typeof body !== "object" || body === null) return body;

  const input = body as Record<string, unknown>;
  const publishedAt =
    input.publishedAt instanceof Date
      ? input.publishedAt
      : typeof input.publishedAt === "string"
        ? new Date(input.publishedAt)
        : null;

  return {
    title: input.title,
    description: input.description ?? input.content,
    publishedDate:
      input.publishedDate ??
      (publishedAt && !Number.isNaN(publishedAt.getTime())
        ? publishedAt.toISOString().slice(0, 10)
        : undefined),
    category: input.category,
    tags: parseTags(input.tags),
    audience: input.audience,
    author: input.author,
    pdfUrl: input.pdfUrl ?? input.attachmentUrl ?? "",
    featured: parseBoolean(input.featured ?? input.showInPopup, false),
    published: parseBoolean(input.published, true),
    slug: input.slug,
    removePdf: parseBoolean(input.removePdf, false),
    removeImage: parseBoolean(input.removeImage, false),
  };
}

export const createNoticeSchema = z.preprocess(normalizeNoticeBody, noticeFieldsSchema);
export const updateNoticeSchema = z.preprocess(
  normalizeNoticeBody,
  noticeFieldsSchema.partial()
);
