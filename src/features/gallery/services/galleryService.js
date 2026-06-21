import { apiClient } from "../../../api/apiClient"; // Adjust path to your apiClient

export const galleryService = {
  // Public Fetchers
  listPublicAlbums: async () => {
    const response = await apiClient.get("/gallery"); // Assumes an endpoint exists for public list
    return response.data;
  },

  getPublicAlbumBySlug: async (slug) => {
    const response = await apiClient.get(`/gallery/${slug}`);
    return response.data;
  },

  // Admin Fetchers (if needed later)
  listAdminAlbums: async (query = {}) => {
    const params = new URLSearchParams(query).toString();
    const response = await apiClient.get(`/gallery/admin?${params}`);
    return response.data;
  },
};