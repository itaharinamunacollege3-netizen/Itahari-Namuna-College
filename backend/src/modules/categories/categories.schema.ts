import { z } from "zod";

// ── Staff Category Schemas ──

export const createStaffCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .default(true),
});

export const updateStaffCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .optional(),
});

// ── Faculty Department Schemas ──

export const createFacultyDepartmentSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .default(true),
});

export const updateFacultyDepartmentSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .optional(),
});

// ── Facility Category Schemas ──

export const createFacilityCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .default(true),
});

export const updateFacilityCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .optional(),
});

// ── Unit Category Schemas ──

export const createUnitCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .default(true),
});

export const updateUnitCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z
    .union([z.boolean(), z.literal("true").transform(() => true), z.literal("false").transform(() => false)])
    .optional(),
});
