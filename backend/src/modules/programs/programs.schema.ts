import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(60)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase letters, numbers, and hyphens");

const curriculumSemesterSchema = z.object({
  subjects: z.array(z.string().trim().min(1)).default([]),
  syllabusPdf: z.string().trim().max(2000).optional(),
});

const curriculumSchema = z.record(z.string().trim().min(1), curriculumSemesterSchema);

const programFieldsSchema = z.object({
  title: z.string().trim().min(3).max(200),
  code: z.string().trim().min(2).max(20).optional(),
  slug: slugSchema.optional(),
  image: z.string().trim().max(2000).optional(),
  duration: z.string().trim().max(100).optional(),
  university: z.string().trim().max(200).optional(),
  tagline: z.string().trim().max(300).optional(),
  overview: z.string().trim().min(20),
  objectives: z.array(z.string().trim().min(1)).min(1),
  careerPathways: z.array(z.string().trim().min(1)).min(1),
  eligibility: z.array(z.string().trim().min(1)).min(1),
  highlights: z.array(z.string().trim().min(1)).min(1),
  curriculum: curriculumSchema,
  seats: z.coerce.number().int().min(0).max(9999).nullable().optional(),
  isFeatured: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

function parseStringArray(value: unknown): string[] {
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

function parseCurriculum(
  value: unknown
): Record<string, { subjects: string[]; syllabusPdf?: string }> {
  if (typeof value === "string") {
    try {
      return parseCurriculum(JSON.parse(value));
    } catch {
      return {};
    }
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Record<string, { subjects: string[]; syllabusPdf?: string }> = {};

  for (const [semester, details] of Object.entries(value as Record<string, unknown>)) {
    if (Array.isArray(details)) {
      result[String(semester)] = {
        subjects: parseStringArray(details),
      };
      continue;
    }

    if (details && typeof details === "object") {
      const record = details as Record<string, unknown>;
      const syllabusPdf =
        typeof record.syllabusPdf === "string" ? record.syllabusPdf.trim() : undefined;

      result[String(semester)] = {
        subjects: parseStringArray(record.subjects),
        ...(syllabusPdf ? { syllabusPdf } : {}),
      };
      continue;
    }

    result[String(semester)] = { subjects: [] };
  }

  return result;
}

function parseBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return fallback;
}

function normalizeProgramBody(body: unknown): unknown {
  if (typeof body !== "object" || body === null) return body;
  const input = body as Record<string, unknown>;

  return {
    title: input.title,
    code: input.code ?? input.programCode,
    slug: input.slug ?? input.id,
    image: input.image,
    duration: input.duration,
    university: input.university,
    tagline: input.tagline,
    overview: input.overview ?? input.description,
    objectives: parseStringArray(input.objectives),
    careerPathways: parseStringArray(input.careerPathways),
    eligibility: parseStringArray(input.eligibility),
    highlights: parseStringArray(input.highlights),
    curriculum: parseCurriculum(input.curriculum),
    seats: input.seats === "" || input.seats === null ? null : input.seats,
    isFeatured: parseBoolean(input.isFeatured, true),
    sortOrder: input.sortOrder,
    published: parseBoolean(input.published, true),
  };
}

export const listProgramsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  search: z.string().trim().optional(),
  featured: z.enum(["true", "false"]).optional(),
});

export const publicListProgramsQuerySchema = z.object({
  featured: z.enum(["true", "false"]).optional(),
});

export const programIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const programSemesterParamSchema = z.object({
  id: z.coerce.number().int().positive(),
  semester: z
    .string()
    .trim()
    .regex(/^[1-8]$/, "semester must be between 1 and 8"),
});

export const programSlugParamSchema = z.object({
  slug: slugSchema,
});

export const createProgramSchema = z.preprocess(normalizeProgramBody, programFieldsSchema);
export const updateProgramSchema = z.preprocess(normalizeProgramBody, programFieldsSchema.partial());

export const reorderProgramsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.coerce.number().int().positive(),
        sortOrder: z.coerce.number().int().min(0),
      })
    )
    .min(1)
    .max(100),
});
