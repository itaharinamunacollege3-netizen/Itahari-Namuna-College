import { z } from "zod";

function parseBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return fallback;
}

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed)
          ? parsed.map(String).map((s) => s.trim()).filter(Boolean)
          : [];
      } catch {
        return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export const listFacilitiesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(100),
  categoryId: z.coerce.number().int().min(1).optional(),
});

export const facilityIdParamSchema = z.object({
  id: z.string().trim().min(1),
});

const facilityFieldsSchema = z.object({
  index: z.string().trim().min(1),
  categoryId: z.coerce.number().int().min(1),
  title: z.string().trim().min(3),
  tagline: z.string().trim().min(3),
  descriptions: z.array(z.string().trim().min(10)).min(1),
  specs: z.array(z.string().trim().min(1)).min(1),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
  slug: z.string().trim().optional(),
  removeImage: z.boolean().default(false),
});

function normalizeFacilityBody(body: unknown): unknown {
  if (typeof body !== "object" || body === null) return body;

  const input = body as Record<string, unknown>;

  return {
    index: input.index,
    categoryId: input.categoryId,
    title: input.title,
    tagline: input.tagline,
    descriptions: parseStringArray(input.descriptions),
    specs: parseStringArray(input.specs),
    featured: parseBoolean(input.featured, false),
    published: parseBoolean(input.published, true),
    sortOrder: input.sortOrder,
    slug: input.slug,
    removeImage: parseBoolean(input.removeImage, false),
  };
}

export const createFacilitySchema = z.preprocess(
  normalizeFacilityBody,
  facilityFieldsSchema
);

export const updateFacilitySchema = z.preprocess(
  normalizeFacilityBody,
  facilityFieldsSchema.partial()
);
