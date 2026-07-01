export interface FacilityListItemDto {
  id: number;
  slug: string;
  index: string;
  categoryId: number;
  category: string;
  title: string;
  tagline: string;
  descriptions: string[];
  imageUrl: string;
  specs: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

export interface FacilityDetailDto extends FacilityListItemDto {}

export interface ListFacilitiesParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  publishedOnly?: boolean;
}

export interface FacilityWriteInput {
  index: string;
  categoryId: number;
  title: string;
  tagline: string;
  descriptions: string[];
  specs: string[];
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
  slug?: string;
  removeImage?: boolean;
}

export interface FacilityUploadFiles {
  image?: Express.Multer.File;
}
