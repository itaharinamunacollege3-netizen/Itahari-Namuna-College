import type { Program } from "../../generated/prisma/client";
import type { ProgramAdminDto, ProgramPublicDto } from "./programs.types";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).map((item) => item.trim()).filter(Boolean);
}

function asCurriculum(value: unknown): Record<string, string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Record<string, string[]> = {};
  for (const [semester, subjects] of Object.entries(value as Record<string, unknown>)) {
    result[String(semester)] = asStringArray(subjects);
  }
  return result;
}

export function formatProgramPublic(program: Program): ProgramPublicDto {
  return {
    id: program.slug,
    title: program.title,
    code: program.code,
    image: program.image ?? "",
    duration: program.duration ?? "",
    university: program.university ?? "",
    tagline: program.tagline ?? "",
    overview: program.overview,
    objectives: asStringArray(program.objectives),
    careerPathways: asStringArray(program.careerPathways),
    eligibility: asStringArray(program.eligibility),
    highlights: asStringArray(program.highlights),
    curriculum: asCurriculum(program.curriculum),
    seats: program.seats,
    isFeatured: program.isFeatured,
    sortOrder: program.sortOrder,
  };
}

export function formatProgramAdmin(program: Program): ProgramAdminDto {
  return {
    ...formatProgramPublic(program),
    dbId: program.id,
    slug: program.slug,
    published: program.published,
    createdAt: program.createdAt.toISOString(),
    updatedAt: program.updatedAt.toISOString(),
  };
}
