import { z } from "zod";

export const listNoticesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(15),
  search: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
});

export const latestNoticesQuerySchema = z.object({
  popup: z.enum(["true", "false"]).optional(),
  marquee: z.enum(["true", "false"]).optional(),
});

export const createNoticeSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(1),
  summary: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  audience: z.string().optional(),
  author: z.string().optional(),
  attachmentUrl: z.string().url().optional().or(z.literal("")),
  attachmentType: z.enum(["pdf", "image"]).optional(),
  published: z.boolean().default(true),
  showInPopup: z.boolean().default(false),
  showInMarquee: z.boolean().default(false),
  marqueeText: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  slug: z.string().optional(),
});

export const updateNoticeSchema = createNoticeSchema.partial();
