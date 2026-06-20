import { z } from "zod";

export const listFacultyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  department: z.string().optional(), // slug or id
  search: z.string().optional(),
});

export const publicFacultyQuerySchema = z.object({
  department: z.string().optional(), // slug or id
});

/**
 * Schema for multipart/form-data body (photo comes from req.file, not body).
 * All fields are coerced because multipart sends everything as strings.
 */
export const createFacultySchema = z.object({
  name: z.string().min(2),
  designation: z.string().min(2),
  departmentId: z.coerce.number().int().min(1),
  qualification: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  isHOD: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .default(true),
});

export const updateFacultySchema = z.object({
  name: z.string().min(2).optional(),
  designation: z.string().min(2).optional(),
  departmentId: z.coerce.number().int().min(1).optional(),
  qualification: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  isHOD: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  published: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .optional(),
});
