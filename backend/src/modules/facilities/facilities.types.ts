export interface FacilityListItemDto {
  id: number;
  slug: string;
  index: string;
  category: string;
  title: string;
  tagline: string;
  descriptionPart1: string;
  descriptionPart2: string;
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
  category?: string;
  publishedOnly?: boolean;
}

export interface FacilityWriteInput {
  index: string;
  category: string;
  title: string;
  tagline: string;
  descriptionPart1: string;
  descriptionPart2: string;
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
