import { apiRequest, apiFormRequest, buildQuery } from "./apiClient";

function buildJournalFormData(data, files) {
  const form = new FormData();
  const entries = {
    title: data.title,
    abstract: data.abstract,
    field: data.field,
    authors: JSON.stringify(data.authors ?? []),
    authorAffiliation: data.authorAffiliation ?? "",
    volume: data.volume,
    year: data.year,
    doi: data.doi ?? "",
    keywords: JSON.stringify(data.keywords ?? []),
    accentColor: data.accentColor ?? "#045d30",
    sections: JSON.stringify(data.sections ?? []),
    callout: data.callout ? JSON.stringify(data.callout) : "",
    citeSuggestion: data.citeSuggestion ?? "",
    slug: data.slug ?? "",
    featured: String(Boolean(data.featured)),
    isPopular: String(Boolean(data.isPopular)),
    published: String(data.published !== false),
    publishedAt: data.publishedAt ?? "",
    sortOrder: String(data.sortOrder ?? 0),
    removeCover: String(Boolean(data.removeCover)),
    removePdf: String(Boolean(data.removePdf)),
  };

  Object.entries(entries).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, value);
  });

  if (files?.cover) form.append("cover", files.cover);
  if (files?.pdf) form.append("pdf", files.pdf);
  return form;
}

export async function listJournals(params) {
  return apiRequest(`/admin/journals${buildQuery(params ?? {})}`);
}

export async function getJournal(id) {
  return apiRequest(`/admin/journals/${id}`);
}

export async function createJournal(data, files) {
  if (files?.cover || files?.pdf) {
    return apiFormRequest("/admin/journals", buildJournalFormData(data, files));
  }
  return apiRequest("/admin/journals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateJournal(id, data, files) {
  if (files?.cover || files?.pdf) {
    return apiFormRequest(`/admin/journals/${id}`, buildJournalFormData(data, files), "PATCH");
  }
  return apiRequest(`/admin/journals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteJournal(id) {
  return apiRequest(`/admin/journals/${id}`, { method: "DELETE" });
}

export async function removeJournalCover(id) {
  return apiRequest(`/admin/journals/${id}/cover`, { method: "DELETE" });
}

export async function removeJournalPdf(id) {
  return apiRequest(`/admin/journals/${id}/pdf`, { method: "DELETE" });
}
