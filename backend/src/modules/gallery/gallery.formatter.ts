import type { AlbumWithImages } from "./gallery.types";
import type {
  GalleryAlbumPublicDto,
  GalleryAlbumSummaryDto,
  GalleryAlbumAdminDto,
  GalleryImageAdminDto,
} from "./gallery.types";
import type { GalleryImage } from "../../generated/prisma/client";

function sortImages(images: GalleryImage[]) {
  return [...images].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}

export function formatAlbumPublic(album: AlbumWithImages): GalleryAlbumPublicDto {
  const images = sortImages(album.images);
  return {
    id: album.slug,
    title: album.title,
    coverImage: album.coverImage ?? images[0]?.imageUrl ?? "",
    description: album.description ?? "",
    images: images.map((img) => img.imageUrl),
  };
}

export function formatAlbumSummary(album: AlbumWithImages): GalleryAlbumSummaryDto {
  return {
    id: album.slug,
    title: album.title,
    coverImage: album.coverImage ?? album.images[0]?.imageUrl ?? "",
    description: album.description ?? "",
    imageCount: album._count?.images ?? album.images.length,
    isFeatured: album.isFeatured,
  };
}

function formatImageAdmin(image: GalleryImage): GalleryImageAdminDto {
  return {
    id: image.id,
    imageUrl: image.imageUrl,
    caption: image.caption,
    sortOrder: image.sortOrder,
  };
}

export function formatAlbumAdmin(album: AlbumWithImages): GalleryAlbumAdminDto {
  return {
    id: album.id,
    slug: album.slug,
    title: album.title,
    coverImage: album.coverImage,
    description: album.description,
    isFeatured: album.isFeatured,
    sortOrder: album.sortOrder,
    published: album.published,
    images: sortImages(album.images).map(formatImageAdmin),
    createdAt: album.createdAt.toISOString(),
    updatedAt: album.updatedAt.toISOString(),
  };
}
