import { apiRequest, buildQuery } from "./apiClient";

export async function getAdmission(id) {
  return apiRequest(`/admin/admissions/${id}`);
}

export async function listAdmissions(params) {
  return apiRequest(`/admin/admissions${buildQuery(params)}`);
}

export async function updateAdmissionStatus(id, status, adminNotes) {
  return apiRequest(`/admin/admissions/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, adminNotes }),
  });
}

export async function exportAdmissionsCsv(params) {
  const token = localStorage.getItem("inc_admin_access");
  const res = await fetch(
    `/api/admin/admissions/export${buildQuery(params)}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Export failed");
  return res.blob();
}
