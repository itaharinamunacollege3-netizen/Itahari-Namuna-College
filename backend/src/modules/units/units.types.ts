export interface UnitListItemDto {
  id: number;
  slug: string;
  code: string;
  categoryId: number;
  category: string;
  title: string;
  objectives: string[];
  duties: string[];
  actionPlan: Array<{ sn: number; activity: string; byWhen: string; byWho: string; budget: string }>;
  iconUrl: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

export interface UnitDetailDto extends UnitListItemDto {}

export interface ListUnitsParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  publishedOnly?: boolean;
}

export interface UnitWriteInput {
  code: string;
  categoryId: number;
  title: string;
  objectives: string[];
  duties: string[];
  actionPlan: Array<{ sn: number; activity: string; byWhen: string; byWho: string; budget: string }>;
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
  slug?: string;
  removeIcon?: boolean;
}

export interface UnitUploadFiles {
  icon?: Express.Multer.File;
}
