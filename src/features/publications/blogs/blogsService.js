import { apiClient } from '../../../api/apiClient';
import { mockBlogPosts, mockPopularPosts } from './mockBlogs';

const HAS_API = Boolean(import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL);

function blogPath(idOrSlug) {
  return `/publications/blog/${idOrSlug}`;
}

export function getBlogLink(post) {
  return blogPath(post.slug || post.id);
}

async function fetchData(path) {
  const body = await apiClient.get(path);
  return body?.data;
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
    const data = await fetchData(`/blogs${qs ? `?${qs}` : ''}`);
    return data ?? [];
  } catch {
    return mockBlogPosts;
  }
}

export async function getFeaturedBlog() {
  if (!HAS_API) {
    return mockBlogPosts[0] ?? null;
  }

  try {
    const data = await fetchData('/blogs/featured');
    return data ?? mockBlogPosts[0] ?? null;
  } catch {
    return mockBlogPosts[0] ?? null;
  }
}

export async function getPopularBlogs(limit = 4) {
  if (!HAS_API) {
    return mockPopularPosts;
  }

  try {
    const data = await fetchData(`/blogs/popular?limit=${limit}`);
    return data ?? mockPopularPosts;
  } catch {
    return mockPopularPosts;
  }
}

export async function getBlogCategories() {
  if (!HAS_API) {
    return [...new Set(mockBlogPosts.map((post) => post.category))];
  }

  try {
    const data = await fetchData('/blogs/categories');
    return data ?? [];
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
    const data = await fetchData(`/blogs/${encodeURIComponent(idOrSlug)}`);
    return data ?? null;
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
    const data = await fetchData(`/blogs/${encodeURIComponent(idOrSlug)}/related`);
    return data ?? [];
  } catch {
    return [];
  }
}
