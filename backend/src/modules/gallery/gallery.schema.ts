import { z } from "zod";

export const listGalleryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  search: z.string().trim().optional(),
});

export const adminListGalleryQuerySchema = listGalleryQuerySchema.extend({
  published: z.enum(["true", "false"]).optional(),
});

export const albumSlugParamSchema = z.object({
  slug: z.string().trim().min(1).max(120),
});

export const albumIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const imageIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
  imageId: z.coerce.number().int().positive(),
});

const albumFieldsSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().max(1000).optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase letters, numbers, and hyphens")
    .optional(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const createAlbumSchema = albumFieldsSchema;

export const updateAlbumSchema = albumFieldsSchema.partial();

export const reorderImagesSchema = z.object({
  imageIds: z.array(z.coerce.number().int().positive()).min(1).max(100),
});

export const updateImageCaptionSchema = z.object({
  caption: z.string().trim().max(300).optional(),
});
