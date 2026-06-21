import { apiRequest, apiFormRequest, buildQuery } from "./apiClient";

export async function listGalleryAlbums(params) {
  return apiRequest(`/admin/gallery${buildQuery(params ?? {})}`);
}

export async function getGalleryAlbum(id) {
  return apiRequest(`/admin/gallery/${id}`);
}

export async function createGalleryAlbum(data) {
  return apiRequest("/admin/gallery", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateGalleryAlbum(id, data) {
  return apiRequest(`/admin/gallery/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteGalleryAlbum(id) {
  return apiRequest(`/admin/gallery/${id}`, { method: "DELETE" });
}

export async function uploadAlbumCover(id, file) {
  const form = new FormData();
  form.append("cover", file);
  return apiFormRequest(`/admin/gallery/${id}/cover`, form);
}

export async function uploadAlbumImages(id, files) {
  const form = new FormData();
  files.forEach((file) => form.append("images", file));
  return apiFormRequest(`/admin/gallery/${id}/images`, form);
}

export async function deleteGalleryImage(albumId, imageId) {
  return apiRequest(`/admin/gallery/${albumId}/images/${imageId}`, {
    method: "DELETE",
  });
}

export async function updateImageCaption(albumId, imageId, caption) {
  return apiRequest(`/admin/gallery/${albumId}/images/${imageId}`, {
    method: "PATCH",
    body: JSON.stringify({ caption }),
  });
}

export async function reorderGalleryImages(albumId, imageIds) {
  return apiRequest(`/admin/gallery/${albumId}/images/reorder`, {
    method: "PATCH",
    body: JSON.stringify({ imageIds }),
  });
}
