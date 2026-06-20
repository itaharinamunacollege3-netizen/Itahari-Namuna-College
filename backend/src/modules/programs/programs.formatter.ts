import type { Program } from "../../generated/prisma/client";
import type { ProgramAdminDto, ProgramPublicDto, ProgramCurriculum } from "./programs.types";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).map((item) => item.trim()).filter(Boolean);
}

function asCurriculum(value: unknown): ProgramCurriculum {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: ProgramCurriculum = {};

  for (const [semester, details] of Object.entries(value as Record<string, unknown>)) {
    if (Array.isArray(details)) {
      result[String(semester)] = { subjects: asStringArray(details) };
      continue;
    }

    if (details && typeof details === "object") {
      const record = details as Record<string, unknown>;
      const syllabusPdf =
        typeof record.syllabusPdf === "string" ? record.syllabusPdf.trim() : "";

      result[String(semester)] = {
        subjects: asStringArray(record.subjects),
        ...(syllabusPdf ? { syllabusPdf } : {}),
      };
      continue;
    }

    result[String(semester)] = { subjects: [] };
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
