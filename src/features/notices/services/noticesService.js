import { mockNotices } from '../data/mockNotices';

// Single integration point for the notices backend. When VITE_API_BASE_URL is
// set, these functions hit the public notices API and adapt each record to the
// shape the components consume. With no API configured (or on any network
// error) they fall back to the bundled mock data so the UI still renders.

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

async function fetchJson(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const body = await res.json();
  if (!res.ok || !body?.success) {
    throw new Error(body?.message ?? `Request failed: ${path}`);
  }
  return body.data;
}

export async function getNotices() {
  if (!BASE_URL) return sortByNewest(mockNotices);
  try {
    const data = await fetchJson('/notices');
    return sortByNewest((data ?? []).map(adaptNotice));
  } catch {
    return sortByNewest(mockNotices);
  }
}

export async function getNoticeById(id) {
  if (!BASE_URL) {
    return mockNotices.find((n) => String(n.id) === String(id)) ?? null;
  }
  try {
    const data = await fetchJson(`/notices/${id}`);
    return data ? adaptNotice(data) : null;
  } catch {
    return mockNotices.find((n) => String(n.id) === String(id)) ?? null;
  }
}

export async function getFeaturedNotice() {
  if (BASE_URL) {
    try {
      const data = await fetchJson('/notices/featured');
      if (data) return adaptNotice(data);
    } catch {
      // fall through to mock data below
    }
  }
  const featured = mockNotices.find((n) => n.featured);
  if (featured) return featured;
  return sortByNewest(mockNotices)[0] ?? null;
}
