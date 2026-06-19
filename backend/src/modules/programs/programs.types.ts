import type { Program } from "../../generated/prisma/client";

/** Public shape matching `courseMatrix.json` / frontend program pages. */
export interface ProgramPublicDto {
  id: string;
  title: string;
  code: string;
  image: string;
  duration: string;
  university: string;
  tagline: string;
  overview: string;
  objectives: string[];
  careerPathways: string[];
  eligibility: string[];
  highlights: string[];
  curriculum: Record<string, string[]>;
  seats: number | null;
  isFeatured: boolean;
  sortOrder: number;
}

export interface ProgramAdminDto extends ProgramPublicDto {
  dbId: number;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramWriteInput {
  title: string;
  code?: string;
  slug?: string;
  image?: string;
  duration?: string;
  university?: string;
  tagline?: string;
  overview: string;
  objectives: string[];
  careerPathways: string[];
  eligibility: string[];
  highlights: string[];
  curriculum: Record<string, string[]>;
  seats?: number | null;
  isFeatured?: boolean;
  sortOrder?: number;
  published?: boolean;
}

export interface ListProgramsParams {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
  publishedOnly?: boolean;
}

export interface ReorderProgramItem {
  id: number;
  sortOrder: number;
}

export type ProgramRecord = Program;
