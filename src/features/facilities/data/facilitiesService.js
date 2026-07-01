import { apiClient } from '../../../api/apiClient';

export async function getFacilities(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.categoryId) query.set('categoryId', params.categoryId);
    const qs = query.toString();
    const res = await apiClient.get(`/facilities${qs ? `?${qs}` : ''}`);
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getFeaturedFacility() {
  try {
    const res = await apiClient.get('/facilities/featured');
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function getFacilityCategories() {
  try {
    const res = await apiClient.get('/facilities/categories');
    return res.data ?? [];
  } catch {
    return [];
  }
}
