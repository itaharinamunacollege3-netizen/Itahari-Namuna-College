/** Public API shape consumed by the frontend (mockNotices contract). */
export interface NoticeApiDto {
  id: number;
  title: string;
  description: string;
  publishedDate: string;
  category: string;
  slug: string;
  author: string | null;
  audience: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  pdfUrl: string;
  imageUrl: string;
}

export interface ListNoticesParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  publishedOnly?: boolean;
}

export interface NoticeWriteInput {
  title: string;
  description: string;
  publishedDate: string;
  category: string;
  tags: string[];
  audience?: string;
  author?: string;
  pdfUrl?: string;
  featured?: boolean;
  published?: boolean;
  slug?: string;
  removePdf?: boolean;
  removeImage?: boolean;
}

export interface NoticeUploadFiles {
  pdf?: Express.Multer.File;
  image?: Express.Multer.File;
}
