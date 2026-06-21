import courseData from "../data/courseMatrix.json";
import { apiClient } from "../../../api/apiClient";

function normalizeCurriculum(curriculum) {
  if (!curriculum || typeof curriculum !== "object" || Array.isArray(curriculum)) return {};

  const result = {};
  for (const [semester, value] of Object.entries(curriculum)) {
    if (Array.isArray(value)) {
      result[String(semester)] = { subjects: value };
      continue;
    }
    result[String(semester)] = {
      subjects: Array.isArray(value?.subjects) ? value.subjects : [],
    };
  }
  return result;
}

function adaptProgram(program) {
  const rawId = program?.id ?? program?.slug ?? "";
  const id = String(rawId);
  const code = String(program?.code ?? id).toUpperCase();

  return {
    ...program,
    id,
    code,
    curriculum: normalizeCurriculum(program?.curriculum),
  };
}

function getFallbackPrograms() {
  return (courseData?.programs ?? []).map((program) => adaptProgram(program));
}

async function fetchData(path) {
  const body = await apiClient.get(path);
  return body?.data;
}

export async function getPrograms() {
  try {
    const data = await fetchData("/programs");
    const programs = Array.isArray(data?.programs) ? data.programs : [];
    return programs.map(adaptProgram);
  } catch {
    return getFallbackPrograms();
  }
}

export async function getProgramBySlug(slug) {
  try {
    const data = await fetchData(`/programs/${slug}`);
    return data ? adaptProgram(data) : null;
  } catch {
    return getFallbackPrograms().find((program) => program.id === String(slug)) ?? null;
  }
}
