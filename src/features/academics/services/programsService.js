import courseData from "../data/courseMatrix.json";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function normalizeCurriculum(curriculum) {
  if (!curriculum || typeof curriculum !== "object" || Array.isArray(curriculum)) return {};

  const result = {};
  for (const [semester, value] of Object.entries(curriculum)) {
    if (Array.isArray(value)) {
      result[String(semester)] = { subjects: value, syllabusPdf: "" };
      continue;
    }

    result[String(semester)] = {
      subjects: Array.isArray(value?.subjects) ? value.subjects : [],
      syllabusPdf: typeof value?.syllabusPdf === "string" ? value.syllabusPdf : "",
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

async function fetchJson(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  const body = await response.json();

  if (!response.ok || !body?.success) {
    throw new Error(body?.message ?? `Request failed: ${path}`);
  }

  return body.data;
}

export async function getPrograms() {
  if (!BASE_URL) return getFallbackPrograms();

  try {
    const data = await fetchJson("/programs");
    const programs = Array.isArray(data?.programs) ? data.programs : [];
    return programs.map(adaptProgram);
  } catch {
    return getFallbackPrograms();
  }
}

export async function getProgramBySlug(slug) {
  if (!BASE_URL) {
    return getFallbackPrograms().find((program) => program.id === String(slug)) ?? null;
  }

  try {
    const data = await fetchJson(`/programs/${slug}`);
    return data ? adaptProgram(data) : null;
  } catch {
    return getFallbackPrograms().find((program) => program.id === String(slug)) ?? null;
  }
}
