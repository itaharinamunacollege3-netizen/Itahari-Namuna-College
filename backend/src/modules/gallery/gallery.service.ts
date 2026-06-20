import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/apiResponse";
import { uniqueSlug } from "../../utils/slug";
import {
  deleteCloudinaryImage,
  deleteCloudinaryImages,
  uploadGalleryImage,
  uploadGalleryImages,
} from "../../services/cloudinary.service";
import {
  formatAlbumAdmin,
  formatAlbumPublic,
  formatAlbumSummary,
} from "./gallery.formatter";
import type { AlbumWithImages } from "./gallery.types";
import { z } from "zod";
import {
  createAlbumSchema,
  adminListGalleryQuerySchema,
  reorderImagesSchema,
  updateAlbumSchema,
  updateImageCaptionSchema,
} from "./gallery.schema";

const albumInclude = {
  images: { orderBy: [{ sortOrder: "asc" as const }, { id: "asc" as const }] },
};

const albumIncludeWithCount = {
  images: { orderBy: [{ sortOrder: "asc" as const }, { id: "asc" as const }] },
  _count: { select: { images: true } },
};

async function getAlbumOrThrow(id: number): Promise<AlbumWithImages> {
  const album = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: albumInclude,
  });
  if (!album) throw new AppError(404, "Gallery album not found");
  return album;
}

async function getAlbumBySlugOrThrow(slug: string, publishedOnly = true): Promise<AlbumWithImages> {
  const album = await prisma.galleryAlbum.findFirst({
    where: { slug, ...(publishedOnly ? { published: true } : {}) },
    include: albumInclude,
  });
  if (!album) throw new AppError(404, "Gallery album not found");
  return album;
}


export async function listPublicAlbums() {
  const albums = await prisma.galleryAlbum.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    include: albumIncludeWithCount,
  });

  return albums.map(formatAlbumSummary);
}

export async function listFeaturedAlbums() {
  const albums = await prisma.galleryAlbum.findMany({
    where: { published: true, isFeatured: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    include: albumInclude,
  });

  return albums.map(formatAlbumPublic);
}

export async function getPublicAlbumBySlug(slug: string) {
  const album = await getAlbumBySlugOrThrow(slug, true);
  return formatAlbumPublic(album);
}

export async function listAdminAlbums(query: z.infer<typeof adminListGalleryQuerySchema>) {
  const where: Record<string, unknown> = {};

  if (query.published === "true") where.published = true;
  if (query.published === "false") where.published = false;

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
      { slug: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.galleryAlbum.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: albumInclude,
    }),
    prisma.galleryAlbum.count({ where }),
  ]);

  return {
    items: items.map(formatAlbumAdmin),
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getAdminAlbum(id: number) {
  const album = await getAlbumOrThrow(id);
  return formatAlbumAdmin(album);
}

export async function createAlbum(data: z.infer<typeof createAlbumSchema>) {
  const slug =
    data.slug ||
    (await uniqueSlug(data.title, async (s) => !!(await prisma.galleryAlbum.findUnique({ where: { slug: s } }))));

  const album = await prisma.$transaction(async (tx) => {
    const created = await tx.galleryAlbum.create({
      data: {
        title: data.title,
        slug,
        description: data.description ?? null,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
        published: data.published,
      },
      include: albumInclude,
    });

    if (created.isFeatured) {
      await tx.galleryAlbum.updateMany({
        where: { isFeatured: true, id: { not: created.id } },
        data: { isFeatured: false },
      });
    }

    return tx.galleryAlbum.findUniqueOrThrow({ where: { id: created.id }, include: albumInclude });
  });

  return formatAlbumAdmin(album);
}

export async function updateAlbum(id: number, data: z.infer<typeof updateAlbumSchema>) {
  await getAlbumOrThrow(id);

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description ?? null;
  if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
  if (data.published !== undefined) updateData.published = data.published;

  if (data.slug) {
    const taken = await prisma.galleryAlbum.findUnique({ where: { slug: data.slug } });
    if (taken && taken.id !== id) throw new AppError(409, "Slug already in use");
    updateData.slug = data.slug;
  } else if (data.title) {
    updateData.slug = await uniqueSlug(data.title, async (s) => {
      const found = await prisma.galleryAlbum.findUnique({ where: { slug: s } });
      return !!found && found.id !== id;
    });
  }

  const album = await prisma.$transaction(async (tx) => {
    const updated = await tx.galleryAlbum.update({
      where: { id },
      data: updateData,
      include: albumInclude,
    });

    if (data.isFeatured === true) {
      await tx.galleryAlbum.updateMany({
        where: { isFeatured: true, id: { not: updated.id } },
        data: { isFeatured: false },
      });
    }

    return updated;
  });

  return formatAlbumAdmin(album);
}

export async function deleteAlbum(id: number) {
  const album = await getAlbumOrThrow(id);

  const publicIds = [
    album.coverImageCloudinaryId,
    ...album.images.map((img) => img.cloudinaryPublicId),
  ];

  await deleteCloudinaryImages(publicIds);
  await prisma.galleryAlbum.delete({ where: { id } });
}

export async function uploadAlbumCover(id: number, file: Express.Multer.File) {
  const album = await getAlbumOrThrow(id);
  const uploaded = await uploadGalleryImage(file, album.slug);

  if (album.coverImageCloudinaryId) {
    await deleteCloudinaryImage(album.coverImageCloudinaryId);
  }

  const updated = await prisma.galleryAlbum.update({
    where: { id },
    data: {
      coverImage: uploaded.url,
      coverImageCloudinaryId: uploaded.publicId,
    },
    include: albumInclude,
  });

  return formatAlbumAdmin(updated);
}

export async function uploadAlbumImages(id: number, files: Express.Multer.File[]) {
  if (!files.length) throw new AppError(400, "At least one image file is required");

  const album = await getAlbumOrThrow(id);
  const uploads = await uploadGalleryImages(files, album.slug);

  const maxSort = album.images.reduce((max, img) => Math.max(max, img.sortOrder), -1);

  await prisma.galleryImage.createMany({
    data: uploads.map((upload, index) => ({
      albumId: album.id,
      imageUrl: upload.url,
      cloudinaryPublicId: upload.publicId,
      sortOrder: maxSort + index + 1,
    })),
  });

  const updated = await getAlbumOrThrow(id);
  return formatAlbumAdmin(updated);
}

export async function deleteAlbumImage(albumId: number, imageId: number) {
  const image = await prisma.galleryImage.findFirst({
    where: { id: imageId, albumId },
    include: { album: true },
  });

  if (!image) throw new AppError(404, "Gallery image not found");

  await deleteCloudinaryImage(image.cloudinaryPublicId);

  if (image.album.coverImageCloudinaryId === image.cloudinaryPublicId) {
    await prisma.galleryAlbum.update({
      where: { id: albumId },
      data: { coverImage: null, coverImageCloudinaryId: null },
    });
  }

  await prisma.galleryImage.delete({ where: { id: imageId } });
}

export async function reorderAlbumImages(
  albumId: number,
  data: z.infer<typeof reorderImagesSchema>
) {
  const album = await getAlbumOrThrow(albumId);
  const validIds = new Set(album.images.map((img) => img.id));

  for (const imageId of data.imageIds) {
    if (!validIds.has(imageId)) {
      throw new AppError(400, `Image ${imageId} does not belong to this album`);
    }
  }

  await prisma.$transaction(
    data.imageIds.map((imageId, index) =>
      prisma.galleryImage.update({
        where: { id: imageId },
        data: { sortOrder: index },
      })
    )
  );

  return formatAlbumAdmin(await getAlbumOrThrow(albumId));
}

export async function updateImageCaption(
  albumId: number,
  imageId: number,
  data: z.infer<typeof updateImageCaptionSchema>
) {
  const image = await prisma.galleryImage.findFirst({ where: { id: imageId, albumId } });
  if (!image) throw new AppError(404, "Gallery image not found");

  await prisma.galleryImage.update({
    where: { id: imageId },
    data: { caption: data.caption ?? null },
  });

  return formatAlbumAdmin(await getAlbumOrThrow(albumId));
}

/** Seed helper — create album with external URLs (no Cloudinary). */
export async function upsertAlbumFromSeed(data: {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  imageUrls: string[];
  isFeatured?: boolean;
  sortOrder?: number;
}) {
  const album = await prisma.galleryAlbum.upsert({
    where: { slug: data.slug },
    update: {
      title: data.title,
      description: data.description,
      coverImage: data.coverImage,
      isFeatured: data.isFeatured ?? false,
      sortOrder: data.sortOrder ?? 0,
    },
    create: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      coverImage: data.coverImage,
      isFeatured: data.isFeatured ?? false,
      sortOrder: data.sortOrder ?? 0,
      published: true,
    },
    include: albumInclude,
  });

  const existingCount = album.images.length;
  if (existingCount === 0 && data.imageUrls.length > 0) {
    await prisma.galleryImage.createMany({
      data: data.imageUrls.map((url, index) => ({
        albumId: album.id,
        imageUrl: url,
        sortOrder: index,
      })),
    });
  }

  return getAlbumBySlugOrThrow(data.slug, false);
}
