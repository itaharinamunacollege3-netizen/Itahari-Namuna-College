import { z } from "zod";

export const listStaffQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  category: z.string().optional(), // slug or id
  search: z.string().optional(),
});

export const publicStaffQuerySchema = z.object({
  category: z.string().optional(), // slug or id
});

/**
 * Schema for multipart/form-data body (photo comes from req.file, not body).
 * All fields are coerced because multipart sends everything as strings.
 */
export const createStaffSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  department: z.string().min(1).optional(),
  categoryId: z.coerce.number().int().min(1),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .default(true),
});

export const updateStaffSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.string().min(2).optional(),
  department: z.string().min(1).optional(),
  categoryId: z.coerce.number().int().min(1).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  published: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .optional(),
});
