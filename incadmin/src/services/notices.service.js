import { apiRequest, apiFormRequest, buildQuery } from "./apiClient";

function buildNoticeFormData(data, files) {
  const form = new FormData();
  const entries = {
    title: data.title,
    description: data.description,
    publishedDate: data.publishedDate,
    category: data.category,
    tags: JSON.stringify(data.tags ?? []),
    audience: data.audience ?? "",
    author: data.author ?? "",
    pdfUrl: data.pdfUrl ?? "",
    slug: data.slug ?? "",
    featured: String(Boolean(data.featured)),
    published: String(data.published !== false),
    removePdf: String(Boolean(data.removePdf)),
    removeImage: String(Boolean(data.removeImage)),
  };

  Object.entries(entries).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value);
    }
  });

  if (files?.pdf) form.append("pdf", files.pdf);
  if (files?.image) form.append("image", files.image);
  return form;
}

export async function listNotices(params) {
  return apiRequest(`/admin/notices${buildQuery(params ?? {})}`);
}

export async function getNotice(id) {
  return apiRequest(`/admin/notices/${id}`);
}

export async function createNotice(data, files) {
  if (files?.pdf || files?.image) {
    return apiFormRequest("/admin/notices", buildNoticeFormData(data, files));
  }
  return apiRequest("/admin/notices", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateNotice(id, data, files) {
  if (files?.pdf || files?.image) {
    return apiFormRequest(`/admin/notices/${id}`, buildNoticeFormData(data, files), "PATCH");
  }
  return apiRequest(`/admin/notices/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteNotice(id) {
  return apiRequest(`/admin/notices/${id}`, { method: "DELETE" });
}

export async function removeNoticePdf(id) {
  return apiRequest(`/admin/notices/${id}/pdf`, { method: "DELETE" });
}

export async function removeNoticeImage(id) {
  return apiRequest(`/admin/notices/${id}/image`, { method: "DELETE" });
}
