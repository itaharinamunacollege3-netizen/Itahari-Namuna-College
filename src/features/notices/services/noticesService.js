import { apiClient } from '../../../api/apiClient';
import { mockNotices } from '../data/mockNotices';

// Single integration point for the notices backend. These functions hit the
// public notices API through apiClient and adapt each record to the shape the
// components consume. On any network error they fall back to the bundled mock
// data so the UI still renders.

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

function sortByNewest(notices) {
  return [...notices].sort((a, b) =>
    a.publishedDate < b.publishedDate ? 1 : -1
  );
}

// Builds the { day, month } badge the cards render from a YYYY-MM-DD string.
function toDateBadge(publishedDate) {
  const [, month, day] = String(publishedDate ?? '').split('-');
  return {
    day: day ?? '',
    month: MONTHS[Number(month) - 1] ?? '',
  };
}

// Maps a backend NoticeApiDto onto the field names the components expect.
function adaptNotice(dto) {
  return {
    ...dto,
    image: dto.imageUrl ?? '',
    date: toDateBadge(dto.publishedDate),
  };
}

async function fetchData(path) {
  const body = await apiClient.get(path);
  return body?.data;
}

// Applies the same search/tag rules the backend uses, for the mock fallback.
function matchesFilters(notice, search, tag) {
  const haystack = [notice.title, notice.content, notice.description, notice.author]
    .map((field) => String(field ?? '').toLowerCase());
  const matchesSearch = !search || haystack.some((field) => field.includes(search.toLowerCase()));
  const tags = Array.isArray(notice.tags) ? notice.tags : [];
  const matchesTag = !tag || tags.includes(tag);
  return matchesSearch && matchesTag;
}

export async function getNotices(params = {}) {
  const search = params.search?.trim() ?? '';
  const tag = params.tag?.trim() ?? '';
  try {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (tag) query.set('tag', tag);
    const qs = query.toString();
    const data = await fetchData(`/notices${qs ? `?${qs}` : ''}`);
    return sortByNewest((data ?? []).map(adaptNotice));
  } catch {
    return sortByNewest(mockNotices.filter((n) => matchesFilters(n, search, tag)));
  }
}

export async function getNoticeById(id) {
  try {
    const data = await fetchData(`/notices/${id}`);
    return data ? adaptNotice(data) : null;
  } catch {
    return mockNotices.find((n) => String(n.id) === String(id)) ?? null;
  }
}

export async function getFeaturedNotice() {
  try {
    const data = await fetchData('/notices/featured');
    if (data) return adaptNotice(data);
  } catch {
    // fall through to mock data below
  }
  const featured = mockNotices.find((n) => n.featured);
  if (featured) return featured;
  return sortByNewest(mockNotices)[0] ?? null;
}
