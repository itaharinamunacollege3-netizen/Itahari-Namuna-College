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

function parseActionPlan(value: unknown): Array<{ sn: number; activity: string; byWhen: string; byWho: string; budget: string }> {
  if (Array.isArray(value)) {
    return value.map((item) => ({
      sn: item.sn ?? 0,
      activity: String(item.activity ?? "").trim(),
      byWhen: String(item.byWhen ?? "").trim(),
      byWho: String(item.byWho ?? "").trim(),
      budget: String(item.budget ?? "").trim(),
    }));
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.map((item) => ({
            sn: item.sn ?? 0,
            activity: String(item.activity ?? "").trim(),
            byWhen: String(item.byWhen ?? "").trim(),
            byWho: String(item.byWho ?? "").trim(),
            budget: String(item.budget ?? "").trim(),
          }))
        : [];
    } catch {
      return [];
    }
  }
  return [];
}

export const listUnitsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(100),
  categoryId: z.coerce.number().int().min(1).optional(),
});

export const unitIdParamSchema = z.object({
  id: z.string().trim().min(1),
});

const unitFieldsSchema = z.object({
  code: z.string().trim().min(1),
  categoryId: z.coerce.number().int().min(1),
  title: z.string().trim().min(3),
  objectives: z.array(z.string().trim().min(5)).min(1),
  duties: z.array(z.string().trim().min(5)).min(1),
  actionPlan: z.array(z.object({
    sn: z.coerce.number().int().min(0).default(0),
    activity: z.string().trim().min(2),
    byWhen: z.string().trim().min(1).default(""),
    byWho: z.string().trim().min(1).default(""),
    budget: z.string().trim().min(1).default(""),
  })).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
  slug: z.string().trim().optional(),
  removeIcon: z.boolean().default(false),
});

function normalizeUnitBody(body: unknown): unknown {
  if (typeof body !== "object" || body === null) return body;

  const input = body as Record<string, unknown>;

  return {
    code: input.code,
    categoryId: input.categoryId,
    title: input.title,
    objectives: parseStringArray(input.objectives),
    duties: parseStringArray(input.duties),
    actionPlan: parseActionPlan(input.actionPlan),
    featured: parseBoolean(input.featured, false),
    published: parseBoolean(input.published, true),
    sortOrder: input.sortOrder,
    slug: input.slug,
    removeIcon: parseBoolean(input.removeIcon, false),
  };
}

export const createUnitSchema = z.preprocess(
  normalizeUnitBody,
  unitFieldsSchema
);

export const updateUnitSchema = z.preprocess(
  normalizeUnitBody,
  unitFieldsSchema.partial()
);
