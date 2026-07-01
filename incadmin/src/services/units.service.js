import { apiRequest, apiFormRequest, buildQuery } from "./apiClient";

function buildUnitFormData(data, files) {
  const form = new FormData();
  const entries = {
    code: data.code,
    categoryId: data.categoryId,
    title: data.title,
    objectives: JSON.stringify(data.objectives || []),
    duties: JSON.stringify(data.duties || []),
    actionPlan: JSON.stringify(data.actionPlan || []),
    slug: data.slug || "",
    featured: String(Boolean(data.featured)),
    published: String(data.published !== false),
    sortOrder: String(data.sortOrder || 0),
    removeIcon: String(Boolean(data.removeIcon)),
  };

  Object.entries(entries).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value);
    }
  });

  if (files?.icon) form.append("icon", files.icon);

  return form;
}

export async function listUnits(params) {
  return apiRequest(`/admin/units${buildQuery(params || {})}`);
}

export async function getUnit(id) {
  return apiRequest(`/admin/units/${id}`);
}

export async function createUnit(data, files) {
  const hasFiles = files?.icon;

  if (hasFiles) {
    return apiFormRequest("/admin/units", buildUnitFormData(data, files));
  }
  return apiRequest("/admin/units", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUnit(id, data, files) {
  const hasFiles = files?.icon;

  if (hasFiles) {
    return apiFormRequest(`/admin/units/${id}`, buildUnitFormData(data, files), "PATCH");
  }
  return apiRequest(`/admin/units/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteUnit(id) {
  return apiRequest(`/admin/units/${id}`, { method: "DELETE" });
}

export async function removeUnitIcon(id) {
  return apiRequest(`/admin/units/${id}/icon`, { method: "DELETE" });
}

export async function listUnitCategories() {
  return apiRequest("/admin/categories/unit-categories");
}

export async function createUnitCategory(data) {
  return apiRequest("/admin/categories/unit-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUnitCategory(id, data) {
  return apiRequest(`/admin/categories/unit-categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteUnitCategory(id) {
  return apiRequest(`/admin/categories/unit-categories/${id}`, {
    method: "DELETE",
  });
}
