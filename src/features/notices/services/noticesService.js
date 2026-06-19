import { mockNotices } from '../data/mockNotices';

// This is the ONLY file that needs to change when the backend API is ready.
// Today these functions return the static mock data. Later, swap each body for a
// fetch() call to the notices API — every component already consumes these and
// will keep working unchanged.

function sortByNewest(notices) {
  return [...notices].sort((a, b) =>
    a.publishedDate < b.publishedDate ? 1 : -1
  );
}

export async function getNotices() {
  // Later: return fetch('/api/notices').then((r) => r.json());
  return sortByNewest(mockNotices);
}

export async function getNoticeById(id) {
  // Later: return fetch(`/api/notices/${id}`).then((r) => (r.ok ? r.json() : null));
  const notice = mockNotices.find((n) => String(n.id) === String(id));
  return notice ?? null;
}

export async function getFeaturedNotice() {
  // Later: the API can expose the featured notice directly, or filter the list.
  const featured = mockNotices.find((n) => n.featured);
  if (featured) return featured;
  return sortByNewest(mockNotices)[0] ?? null;
}
