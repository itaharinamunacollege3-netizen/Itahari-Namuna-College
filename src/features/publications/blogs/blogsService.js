import { apiClient } from '../../../api/apiClient';


function blogPath(idOrSlug) {
  return `/publications/blog/${idOrSlug}`;
}

export function getBlogLink(post) {
  return blogPath(post.slug || post.id);
}

export async function getBlogs(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.tag) query.set('tag', params.tag);
    const qs = query.toString();
    const res = await apiClient.get(`/blogs${qs ? `?${qs}` : ''}`);
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getFeaturedBlog() {
  try {
    const res = await apiClient.get('/blogs/featured');
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function getPopularBlogs(limit = 4) {
  try {
    const res = await apiClient.get(`/blogs/popular?limit=${limit}`);
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getBlogCategories() {
  try {
    const res = await apiClient.get('/blogs/categories');
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getBlogById(idOrSlug) {
  try {
    const res = await apiClient.get(`/blogs/${encodeURIComponent(idOrSlug)}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedBlogs(idOrSlug) {
  try {
    const res = await apiClient.get(`/blogs/${encodeURIComponent(idOrSlug)}/related`);
    return res.data ?? [];
  } catch {
    return [];
  }
}
