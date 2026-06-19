import type { GalleryAlbum, GalleryImage } from "../../generated/prisma/client";

export type AlbumWithImages = GalleryAlbum & {
  images: GalleryImage[];
  _count?: { images: number };
};

/** Public API shape — matches frontend galleryData.js */
export interface GalleryAlbumPublicDto {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  images: string[];
}

export interface GalleryAlbumSummaryDto {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  imageCount: number;
  isFeatured: boolean;
}

export interface GalleryImageAdminDto {
  id: number;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

export interface GalleryAlbumAdminDto {
  id: number;
  slug: string;
  title: string;
  coverImage: string | null;
  description: string | null;
  isFeatured: boolean;
  sortOrder: number;
  published: boolean;
  images: GalleryImageAdminDto[];
  createdAt: string;
  updatedAt: string;
}
