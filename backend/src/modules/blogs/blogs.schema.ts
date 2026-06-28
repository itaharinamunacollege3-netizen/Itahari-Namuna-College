import { z } from "zod";

const blogSectionSchema = z.object({
  heading: z.string().trim().min(1),
  body: z.string().trim().min(1),
  bullets: z.array(z.string().trim().min(1)).optional(),
});

const blogCalloutSchema = z
  .object({
    heading: z.string().trim().min(1),
    body: z.string().trim().min(1),
  })
  .nullable()
  .optional();

export const listBlogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(100),
  search: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
});

export const blogIdParamSchema = z.object({
  id: z.string().trim().min(1),
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

function parseSections(value: unknown): z.infer<typeof blogSectionSchema>[] {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return blogSectionSchema.array().min(1).parse(parsed);
    } catch {
      throw new Error("sections must be a valid JSON array");
    }
  }
  return blogSectionSchema.array().min(1).parse(value);
}

function parseCallout(value: unknown): z.infer<typeof blogCalloutSchema> {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return blogCalloutSchema.parse(JSON.parse(trimmed));
  }
  return blogCalloutSchema.parse(value);
}

const blogFieldsSchema = z.object({
  title: z.string().trim().min(3),
  excerpt: z.string().trim().min(10),
  intro: z.string().trim().min(10),
  category: z.string().trim().min(1),
  author: z.string().trim().min(1),
  authorRole: z.string().trim().optional(),
  readTime: z.string().trim().min(1).default("5 min read"),
  sections: z.array(blogSectionSchema).min(1),
  callout: blogCalloutSchema,
  tags: z.array(z.string().trim().min(1)).default([]),
  featured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  published: z.boolean().default(true),
  publishedAt: z.coerce.date().optional(),
  slug: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  removeCover: z.boolean().default(false),
});

function normalizeBlogBody(body: unknown): unknown {
  if (typeof body !== "object" || body === null) return body;

  const input = body as Record<string, unknown>;

  return {
    title: input.title,
    excerpt: input.excerpt,
    intro: input.intro,
    category: input.category,
    author: input.author,
    authorRole: input.authorRole,
    readTime: input.readTime,
    sections: parseSections(input.sections),
    callout: parseCallout(input.callout),
    tags: parseTags(input.tags),
    featured: parseBoolean(input.featured, false),
    isPopular: parseBoolean(input.isPopular, false),
    published: parseBoolean(input.published, true),
    publishedAt: input.publishedAt,
    slug: input.slug,
    sortOrder: input.sortOrder,
    removeCover: parseBoolean(input.removeCover, false),
  };
}

export const createBlogSchema = z.preprocess(normalizeBlogBody, blogFieldsSchema);
export const updateBlogSchema = z.preprocess(
  normalizeBlogBody,
  blogFieldsSchema.partial()
);
