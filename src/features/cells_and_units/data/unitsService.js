import { apiClient } from "../../../api/apiClient";

export async function getUnits(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.categoryId) query.set('categoryId', params.categoryId);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);
    const qs = query.toString();
    const res = await apiClient.get(`/units${qs ? `?${qs}` : ''}`);
    // Backend returns { success: true, data: items, meta: ... }
    return { 
      items: res.data || [], 
      meta: res.meta || {} 
    };
  } catch {
    return { items: [], meta: {} };
  }
}

export async function getFeaturedUnit() {
  try {
    const res = await apiClient.get('/units/featured');
    return res.data || null;
  } catch {
    return null;
  }
}

export async function getUnitCategories() {
  try {
    const res = await apiClient.get('/units/categories');
    return res.data || [];
  } catch {
    return [];
  }
}

export async function getUnitByIdOrSlug(idOrSlug) {
  try {
    const res = await apiClient.get(`/units/${idOrSlug}`);
    return res.data || null;
  } catch {
    return null;
  }
}
