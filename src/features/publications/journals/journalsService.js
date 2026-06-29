import { apiClient } from '../../../api/apiClient';

export function getJournalLink(entry) {
  return `/publications/journal/${entry.slug || entry.id}`;
}

export async function getJournals(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.field) query.set('field', params.field);
    if (params.search) query.set('search', params.search);
    if (params.keyword) query.set('keyword', params.keyword);
    const qs = query.toString();
    const res = await apiClient.get(`/journals${qs ? `?${qs}` : ''}`);
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getFeaturedJournal() {
  try {
    const res = await apiClient.get('/journals/featured');
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function getPopularJournals(limit = 4) {
  try {
    const res = await apiClient.get(`/journals/popular?limit=${limit}`);
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getJournalFields() {
  try {
    const res = await apiClient.get('/journals/fields');
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getJournalById(idOrSlug) {
  try {
    const res = await apiClient.get(`/journals/${encodeURIComponent(idOrSlug)}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedJournals(idOrSlug) {
  try {
    const res = await apiClient.get(`/journals/${encodeURIComponent(idOrSlug)}/related`);
    return res.data ?? [];
  } catch {
    return [];
  }
}
