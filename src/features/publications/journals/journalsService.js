import { apiClient } from '../../../api/apiClient';
import { mockJournalEntries, mockPopularEntries } from './mockJournals';

const HAS_API = Boolean(import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL);

export function getJournalLink(entry) {
  return `/publications/journal/${entry.slug || entry.id}`;
}

export async function getJournals(params = {}) {
  if (!HAS_API) return mockJournalEntries;

  try {
    const query = new URLSearchParams();
    if (params.field) query.set('field', params.field);
    if (params.search) query.set('search', params.search);
    if (params.keyword) query.set('keyword', params.keyword);
    const qs = query.toString();
    const res = await apiClient.get(`/journals${qs ? `?${qs}` : ''}`);
    return res.data ?? [];
  } catch {
    return mockJournalEntries;
  }
}

export async function getFeaturedJournal() {
  if (!HAS_API) return mockJournalEntries[0] ?? null;

  try {
    const res = await apiClient.get('/journals/featured');
    return res.data ?? mockJournalEntries[0] ?? null;
  } catch {
    return mockJournalEntries[0] ?? null;
  }
}

export async function getPopularJournals(limit = 4) {
  if (!HAS_API) return mockPopularEntries;

  try {
    const res = await apiClient.get(`/journals/popular?limit=${limit}`);
    return res.data ?? mockPopularEntries;
  } catch {
    return mockPopularEntries;
  }
}

export async function getJournalFields() {
  if (!HAS_API) {
    return [...new Set(mockJournalEntries.map((entry) => entry.field))];
  }

  try {
    const res = await apiClient.get('/journals/fields');
    return res.data ?? [];
  } catch {
    return [...new Set(mockJournalEntries.map((entry) => entry.field))];
  }
}

export async function getJournalById(idOrSlug) {
  if (!HAS_API) {
    const match = mockJournalEntries.find(
      (entry) => String(entry.id) === String(idOrSlug) || entry.slug === idOrSlug
    );
    if (!match) return mockJournalEntries[0] ? { ...mockJournalEntries[0], ...mockJournalEntries[0].detail } : null;
    return { ...match, ...match.detail };
  }

  try {
    const res = await apiClient.get(`/journals/${encodeURIComponent(idOrSlug)}`);
    return res.data ?? null;
  } catch {
    const match = mockJournalEntries.find(
      (entry) => String(entry.id) === String(idOrSlug) || entry.slug === idOrSlug
    );
    if (!match) return mockJournalEntries[0] ? { ...mockJournalEntries[0], ...mockJournalEntries[0].detail } : null;
    return { ...match, ...match.detail };
  }
}

export async function getRelatedJournals(idOrSlug) {
  if (!HAS_API) {
    return mockJournalEntries
      .filter((entry) => String(entry.id) !== String(idOrSlug) && entry.slug !== idOrSlug)
      .slice(0, 4)
      .map(({ id, slug, title, field, volume }) => ({ id, slug, title, field, volume }));
  }

  try {
    const res = await apiClient.get(`/journals/${encodeURIComponent(idOrSlug)}/related`);
    return res.data ?? [];
  } catch {
    return [];
  }
}
