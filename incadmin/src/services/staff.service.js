import { apiRequest, apiFormRequest, buildQuery } from "./apiClient";

export async function listStaff(params) {
  return apiRequest(`/admin/staff${buildQuery(params ?? {})}`);
}

export async function createStaff(data, photo) {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, String(v));
  });
  if (photo) form.append("photo", photo);
  return apiFormRequest("/admin/staff", form);
}

export async function updateStaff(id, data, photo) {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, String(v));
  });
  if (photo) form.append("photo", photo);
  return apiFormRequest(`/admin/staff/${id}`, form, "PATCH");
}

export async function deleteStaff(id) {
  return apiRequest(`/admin/staff/${id}`, { method: "DELETE" });
}
