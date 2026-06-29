import { z } from "zod";

const journalSectionSchema = z.object({
  heading: z.string().trim().min(1),
  body: z.string().trim().min(1),
  bullets: z.array(z.string().trim().min(1)).optional(),
  imageUrl: z.string().trim().optional(),
  imageCloudinaryId: z.string().trim().optional(),
  removeImage: z.boolean().default(false).optional(),
});

const journalCalloutSchema = z
  .object({
    label: z.string().trim().min(1),
    body: z.string().trim().min(1),
  })
  .nullable()
  .optional();

export const listJournalsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(100),
  search: z.string().optional(),
  field: z.string().optional(),
  keyword: z.string().optional(),
});

export const journalIdParamSchema = z.object({
  id: z.string().trim().min(1),
});

function parseBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return fallback;
}

function parseStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed)
          ? parsed.map(String).map((item) => item.trim()).filter(Boolean)
          : [];
      } catch {
        return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
      }
    }
    return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function parseSections(value: unknown): z.infer<typeof journalSectionSchema>[] {
  if (typeof value === "string") {
    return journalSectionSchema.array().min(1).parse(JSON.parse(value));
  }
  return journalSectionSchema.array().min(1).parse(value);
}

function parseCallout(value: unknown): z.infer<typeof journalCalloutSchema> {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return journalCalloutSchema.parse(JSON.parse(trimmed));
  }
  return journalCalloutSchema.parse(value);
}

const journalFieldsSchema = z.object({
  title: z.string().trim().min(3),
  abstract: z.string().trim().min(20),
  field: z.string().trim().min(1),
  authors: z.array(z.string().trim().min(1)).min(1),
  authorAffiliation: z.string().trim().optional(),
  volume: z.string().trim().min(1),
  year: z.string().trim().min(4).max(4),
  doi: z.string().trim().optional(),
  keywords: z.array(z.string().trim().min(1)).default([]),
  accentColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "accentColor must be a hex color like #045d30")
    .default("#045d30"),
  sections: z.array(journalSectionSchema).min(1),
  callout: journalCalloutSchema,
  citeSuggestion: z.string().trim().optional(),
  featured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  published: z.boolean().default(true),
  publishedAt: z.coerce.date().optional(),
  slug: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  removeCover: z.boolean().default(false),
  removePdf: z.boolean().default(false),
});

function normalizeJournalBody(body: unknown): unknown {
  if (typeof body !== "object" || body === null) return body;
  const input = body as Record<string, unknown>;

  return {
    title: input.title,
    abstract: input.abstract,
    field: input.field,
    authors: parseStringList(input.authors),
    authorAffiliation: input.authorAffiliation,
    volume: input.volume,
    year: input.year,
    doi: input.doi,
    keywords: parseStringList(input.keywords),
    accentColor: input.accentColor,
    sections: parseSections(input.sections),
    callout: parseCallout(input.callout),
    citeSuggestion: input.citeSuggestion,
    featured: parseBoolean(input.featured, false),
    isPopular: parseBoolean(input.isPopular, false),
    published: parseBoolean(input.published, true),
    publishedAt: input.publishedAt,
    slug: input.slug,
    sortOrder: input.sortOrder,
    removeCover: parseBoolean(input.removeCover, false),
    removePdf: parseBoolean(input.removePdf, false),
  };
}

export const createJournalSchema = z.preprocess(normalizeJournalBody, journalFieldsSchema);
export const updateJournalSchema = z.preprocess(
  normalizeJournalBody,
  journalFieldsSchema.partial()
);
