import { apiRequest, apiFormRequest, buildQuery } from "./apiClient";

export async function listPrograms(params) {
  return apiRequest(`/admin/programs${buildQuery(params ?? {})}`);
}

export async function getProgram(id) {
  return apiRequest(`/admin/programs/${id}`);
}

export async function createProgram(data) {
  return apiRequest("/admin/programs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProgram(id, data) {
  return apiRequest(`/admin/programs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProgram(id) {
  return apiRequest(`/admin/programs/${id}`, { method: "DELETE" });
}

export async function reorderPrograms(items) {
  return apiRequest("/admin/programs/reorder", {
    method: "PATCH",
    body: JSON.stringify({ items }),
  });
}

export async function uploadProgramCover(id, file) {
  const form = new FormData();
  form.append("image", file);
  return apiFormRequest(`/admin/programs/${id}/image`, form);
}

export async function removeProgramCover(id) {
  return apiRequest(`/admin/programs/${id}/image`, { method: "DELETE" });
}

export async function uploadProgramSemesterSyllabus(id, semester, file) {
  const form = new FormData();
  form.append("pdf", file);
  return apiFormRequest(`/admin/programs/${id}/syllabus/${semester}/pdf`, form);
}
