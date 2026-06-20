import { apiRequest, buildQuery } from "./apiClient";

export async function listContacts(page = 1, limit = 20) {
  return apiRequest(`/admin/contacts${buildQuery({ page, limit })}`);
}

export async function markContactRead(id) {
  return apiRequest(`/admin/contacts/${id}/read`, { method: "PATCH" });
}
