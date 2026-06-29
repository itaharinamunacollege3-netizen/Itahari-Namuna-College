export interface BlogSectionDto {
  heading: string;
  body: string;
  bullets?: string[];
  imageUrl?: string;
  imageCloudinaryId?: string;
  removeImage?: boolean;
}

export interface BlogCalloutDto {
  heading: string;
  body: string;
}

/** Public API shape consumed by BlogList / BlogDetail. */
export interface BlogListItemDto {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  coverImage: string;
  accentColor: string;
  featured: boolean;
  isPopular: boolean;
  published: boolean;
  publishedAt: string;
  sortOrder: number;
  tags: string[];
  attachmentUrl: string;
}

export interface BlogDetailDto extends BlogListItemDto {
  authorRole: string | null;
  intro: string;
  sections: BlogSectionDto[];
  callout: BlogCalloutDto | null;
}

export interface ListBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  publishedOnly?: boolean;
}

export interface BlogWriteInput {
  title: string;
  excerpt: string;
  intro: string;
  category: string;
  author: string;
  authorRole?: string;
  readTime?: string;
  accentColor?: string;
  sections: BlogSectionDto[];
  callout?: BlogCalloutDto | null;
  tags: string[];
  featured?: boolean;
  isPopular?: boolean;
  published?: boolean;
  publishedAt?: string;
  slug?: string;
  sortOrder?: number;
  removeCover?: boolean;
  removeAttachment?: boolean;
}

export interface BlogUploadFiles {
  cover?: Express.Multer.File;
  attachment?: Express.Multer.File;
  sectionImages?: Express.Multer.File[];
}
