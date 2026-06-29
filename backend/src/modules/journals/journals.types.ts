export interface JournalSectionDto {
  heading: string;
  body: string;
  bullets?: string[];
  imageUrl?: string;
  imageCloudinaryId?: string;
  removeImage?: boolean;
}

export interface JournalCalloutDto {
  label: string;
  body: string;
}

export interface JournalListItemDto {
  id: number;
  slug: string;
  title: string;
  abstract: string;
  field: string;
  authors: string[];
  volume: string;
  year: string;
  date: string;
  coverImage: string;
  accentColor: string;
  featured: boolean;
  isPopular: boolean;
  published: boolean;
  publishedAt: string;
  sortOrder: number;
  pdfUrl: string;
}

export interface JournalDetailDto extends JournalListItemDto {
  authorAffiliation: string | null;
  doi: string | null;
  keywords: string[];
  sections: JournalSectionDto[];
  callout: JournalCalloutDto | null;
  citeSuggestion: string | null;
}

export interface ListJournalsParams {
  page?: number;
  limit?: number;
  search?: string;
  field?: string;
  keyword?: string;
  publishedOnly?: boolean;
}

export interface JournalWriteInput {
  title: string;
  abstract: string;
  field: string;
  authors: string[];
  authorAffiliation?: string;
  volume: string;
  year: string;
  doi?: string;
  keywords: string[];
  accentColor?: string;
  sections: JournalSectionDto[];
  callout?: JournalCalloutDto | null;
  citeSuggestion?: string;
  featured?: boolean;
  isPopular?: boolean;
  published?: boolean;
  publishedAt?: string;
  slug?: string;
  sortOrder?: number;
  removeCover?: boolean;
  removePdf?: boolean;
}

export interface JournalUploadFiles {
  cover?: Express.Multer.File;
  pdf?: Express.Multer.File;
  sectionImages?: Express.Multer.File[];
}
