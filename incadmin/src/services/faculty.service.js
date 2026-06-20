import { apiRequest, apiFormRequest, buildQuery } from "./apiClient";

export async function listFaculty(params) {
  return apiRequest(`/admin/faculty${buildQuery(params ?? {})}`);
}

export async function createFaculty(data, photo) {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, String(v));
  });
  if (photo) form.append("photo", photo);
  return apiFormRequest("/admin/faculty", form);
}

export async function updateFaculty(id, data, photo) {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, String(v));
  });
  if (photo) form.append("photo", photo);
  return apiFormRequest(`/admin/faculty/${id}`, form, "PATCH");
}

export async function deleteFaculty(id) {
  return apiRequest(`/admin/faculty/${id}`, { method: "DELETE" });
}
