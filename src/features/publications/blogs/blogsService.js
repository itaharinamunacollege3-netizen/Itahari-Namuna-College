import { apiClient } from '../../../api/apiClient';
import { mockBlogPosts, mockPopularPosts } from './mockBlogs';

const HAS_API = Boolean(import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL);

function blogPath(idOrSlug) {
  return `/publications/blog/${idOrSlug}`;
}

export function getBlogLink(post) {
  return blogPath(post.slug || post.id);
}

export async function getBlogs(params = {}) {
  if (!HAS_API) {
    return mockBlogPosts;
  }

  try {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.tag) query.set('tag', params.tag);
    const qs = query.toString();
    const res = await apiClient.get(`/blogs${qs ? `?${qs}` : ''}`);
    return res.data ?? [];
  } catch {
    return mockBlogPosts;
  }
}

export async function getFeaturedBlog() {
  if (!HAS_API) {
    return mockBlogPosts[0] ?? null;
  }

  try {
    const res = await apiClient.get('/blogs/featured');
    return res.data ?? mockBlogPosts[0] ?? null;
  } catch {
    return mockBlogPosts[0] ?? null;
  }
}

export async function getPopularBlogs(limit = 4) {
  if (!HAS_API) {
    return mockPopularPosts;
  }

  try {
    const res = await apiClient.get(`/blogs/popular?limit=${limit}`);
    return res.data ?? mockPopularPosts;
  } catch {
    return mockPopularPosts;
  }
}

export async function getBlogCategories() {
  if (!HAS_API) {
    return [...new Set(mockBlogPosts.map((post) => post.category))];
  }

  try {
    const res = await apiClient.get('/blogs/categories');
    return res.data ?? [];
  } catch {
    return [...new Set(mockBlogPosts.map((post) => post.category))];
  }
}

export async function getBlogById(idOrSlug) {
  if (!HAS_API) {
    const match = mockBlogPosts.find(
      (post) => String(post.id) === String(idOrSlug) || post.slug === idOrSlug
    );
    if (!match) return mockBlogPosts[0] ? { ...mockBlogPosts[0], ...mockBlogPosts[0].detail } : null;
    return { ...match, ...match.detail };
  }

  try {
    const res = await apiClient.get(`/blogs/${encodeURIComponent(idOrSlug)}`);
    return res.data ?? null;
  } catch {
    const match = mockBlogPosts.find(
      (post) => String(post.id) === String(idOrSlug) || post.slug === idOrSlug
    );
    if (!match) return mockBlogPosts[0] ? { ...mockBlogPosts[0], ...mockBlogPosts[0].detail } : null;
    return { ...match, ...match.detail };
  }
}

export async function getRelatedBlogs(idOrSlug) {
  if (!HAS_API) {
    return mockBlogPosts
      .filter((post) => String(post.id) !== String(idOrSlug) && post.slug !== idOrSlug)
      .slice(0, 4)
      .map(({ id, slug, title, category, date }) => ({ id, slug, title, category, date }));
  }

  try {
    const res = await apiClient.get(`/blogs/${encodeURIComponent(idOrSlug)}/related`);
    return res.data ?? [];
  } catch {
    return [];
  }
}
