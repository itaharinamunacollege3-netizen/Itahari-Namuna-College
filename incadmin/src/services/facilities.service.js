import { apiRequest, apiFormRequest, buildQuery } from "./apiClient";

function buildFacilityFormData(data, files) {
  const form = new FormData();
  const entries = {
    index: data.index,
    category: data.category,
    title: data.title,
    tagline: data.tagline,
    descriptionPart1: data.descriptionPart1,
    descriptionPart2: data.descriptionPart2,
    specs: JSON.stringify(data.specs ?? []),
    slug: data.slug ?? "",
    featured: String(Boolean(data.featured)),
    published: String(data.published !== false),
    sortOrder: String(data.sortOrder ?? 0),
    removeImage: String(Boolean(data.removeImage)),
  };

  Object.entries(entries).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value);
    }
  });

  if (files?.image) form.append("image", files.image);

  return form;
}

export async function listFacilities(params) {
  return apiRequest(`/admin/facilities${buildQuery(params ?? {})}`);
}

export async function getFacility(id) {
  return apiRequest(`/admin/facilities/${id}`);
}

export async function createFacility(data, files) {
  const hasFiles = files?.image;

  if (hasFiles) {
    return apiFormRequest("/admin/facilities", buildFacilityFormData(data, files));
  }
  return apiRequest("/admin/facilities", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateFacility(id, data, files) {
  const hasFiles = files?.image;

  if (hasFiles) {
    return apiFormRequest(`/admin/facilities/${id}`, buildFacilityFormData(data, files), "PATCH");
  }
  return apiRequest(`/admin/facilities/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteFacility(id) {
  return apiRequest(`/admin/facilities/${id}`, { method: "DELETE" });
}

export async function removeFacilityImage(id) {
  return apiRequest(`/admin/facilities/${id}/image`, { method: "DELETE" });
}
