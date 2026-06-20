import { apiRequest } from "./apiClient";

export async function listStaffCategories() {
  return apiRequest("/admin/categories/staff-categories");
}

export async function listFacultyDepartments() {
  return apiRequest("/admin/categories/faculty-departments");
}

export async function createStaffCategory(data) {
  return apiRequest("/admin/categories/staff-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStaffCategory(id, data) {
  return apiRequest(`/admin/categories/staff-categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteStaffCategory(id) {
  return apiRequest(`/admin/categories/staff-categories/${id}`, {
    method: "DELETE",
  });
}

export async function createFacultyDepartment(data) {
  return apiRequest("/admin/categories/faculty-departments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateFacultyDepartment(id, data) {
  return apiRequest(`/admin/categories/faculty-departments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteFacultyDepartment(id) {
  return apiRequest(`/admin/categories/faculty-departments/${id}`, {
    method: "DELETE",
  });
}
