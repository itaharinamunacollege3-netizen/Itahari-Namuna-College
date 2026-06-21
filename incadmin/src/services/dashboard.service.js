import { listAdmissions } from "./admissions.service";
import { listContacts } from "./contacts.service";
import { listNotices } from "./notices.service";
import { listPrograms } from "./programs.service";
import { listGalleryAlbums } from "./gallery.service";
import { listFaculty } from "./faculty.service";
import { listStaff } from "./staff.service";
import { getUnreadCount } from "./notifications.service";
import { listFacultyDepartments, listStaffCategories } from "./categories.service";

const ADMISSION_STATUSES = ["pending", "under_review", "approved", "rejected"];

/**
 * Safely extract total count from a paginated API response.
 * Prefers `meta.total` (accurate), falls back to `data.length` (page count).
 */
function totalOf(res) {
  return res?.meta?.total ?? res?.data?.length ?? 0;
}

function getMonthRange(baseDate, shiftMonths = 0) {
  const date = new Date(baseDate.getFullYear(), baseDate.getMonth() + shiftMonths, 1);
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function countByMonth(items, dateGetter) {
  const now = new Date();
  const current = getMonthRange(now, 0);
  const previous = getMonthRange(now, -1);
  let currentCount = 0;
  let previousCount = 0;

  for (const item of items ?? []) {
    const date = toDate(dateGetter(item));
    if (!date) continue;
    if (date >= current.start && date < current.end) currentCount += 1;
    if (date >= previous.start && date < previous.end) previousCount += 1;
  }

  return { currentCount, previousCount };
}

function percentChange(currentCount, previousCount) {
  if (previousCount === 0 && currentCount === 0) return 0;
  if (previousCount === 0) return 100;
  return Math.round(((currentCount - previousCount) / previousCount) * 100);
}

function trendOf(items, dateGetter) {
  const { currentCount, previousCount } = countByMonth(items, dateGetter);
  return {
    current: currentCount,
    previous: previousCount,
    percent: percentChange(currentCount, previousCount),
  };
}

function buildMonthlyTrend(applications) {
  const buckets = new Map();
  const now = new Date();

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-US", { month: "short" });
    buckets.set(key, { label, count: 0 });
  }

  for (const app of applications) {
    if (!app.createdAt) continue;
    const date = new Date(app.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (buckets.has(key)) {
      buckets.get(key).count += 1;
    }
  }

  const entries = [...buckets.values()];
  return {
    categories: entries.map((e) => e.label),
    series: entries.map((e) => e.count),
  };
}

function buildWeeklyContactTrend(contacts) {
  const buckets = new Map();
  const now = new Date();

  for (let i = 5; i >= 0; i -= 1) {
    const start = new Date(now);
    start.setDate(now.getDate() - i * 7);
    const key = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;
    buckets.set(key, { label: `W${6 - i}`, count: 0, start });
  }

  for (const contact of contacts) {
    if (!contact.createdAt) continue;
    const date = new Date(contact.createdAt);
    if (Number.isNaN(date.getTime())) continue;

    let chosenKey = null;
    for (const [key, bucket] of buckets.entries()) {
      const end = new Date(bucket.start);
      end.setDate(bucket.start.getDate() + 7);
      if (date >= bucket.start && date < end) {
        chosenKey = key;
      }
    }
    if (chosenKey) {
      buckets.get(chosenKey).count += 1;
    }
  }

  const entries = [...buckets.values()];
  return {
    categories: entries.map((e) => e.label),
    series: entries.map((e) => e.count),
  };
}

function buildProgramsDistribution(admissions, programs) {
  const programCodeMap = new Map(
    (programs ?? []).map((program) => [
      String(program.slug ?? program.id ?? "").toUpperCase(),
      String(program.code ?? program.slug ?? "").toUpperCase(),
    ])
  );

  const counts = new Map();
  for (const app of admissions) {
    const slug = String(app.programApplied ?? "").toUpperCase();
    const code = programCodeMap.get(slug) ?? slug;
    if (!code) continue;
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }

  const sorted = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return {
    categories: sorted.map(([code]) => code),
    series: sorted.map(([, count]) => count),
  };
}

function formatActivityTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

function buildRecentActivities({ admissions = [], contacts = [], notices = [] }) {
  const items = [];

  admissions.slice(0, 4).forEach((admission) => {
    items.push({
      id: `admission-${admission.id}`,
      title: "New admission submission",
      description: `${admission.fullName ?? "Applicant"} applied for ${admission.programApplied ?? "program"}`,
      at: formatActivityTime(admission.createdAt),
      path: "/admissions",
      category: "Admissions",
    });
  });

  contacts.slice(0, 4).forEach((contact) => {
    items.push({
      id: `contact-${contact.id}`,
      title: "New contact inquiry",
      description: `${contact.fullName ?? "Visitor"}: ${contact.subject ?? "General inquiry"}`,
      at: formatActivityTime(contact.createdAt),
      path: "/contacts",
      category: "Contacts",
    });
  });

  notices.slice(0, 4).forEach((notice) => {
    items.push({
      id: `notice-${notice.id ?? notice.slug}`,
      title: "Notice updated",
      description: notice.title ?? "Untitled notice",
      at: formatActivityTime(notice.updatedAt ?? notice.createdAt),
      path: "/notices",
      category: "Notices",
    });
  });

  return items
    .filter((item) => item.at)
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 8);
}

export async function fetchDashboardStats() {
  const [
    pendingRes,
    pendingListRes,
    reviewRes,
    approvedRes,
    rejectedRes,
    recentAdmissionsRes,
    contactsRes,
    noticesRes,
    programsRes,
    programsListRes,
    galleryRes,
    facultyRes,
    staffRes,
    staffCategoriesRes,
    facultyDepartmentsRes,
    unreadNotifications,
  ] = await Promise.all([
    ...ADMISSION_STATUSES.map((status) => listAdmissions({ status, limit: 1 })),
    listAdmissions({ status: "pending", limit: 100 }),
    listAdmissions({ limit: 100 }),
    listContacts(1, 100),
    listNotices({ limit: 100 }),
    listPrograms({ limit: 1 }),
    listPrograms({ limit: 100 }),
    listGalleryAlbums({ limit: 100 }),
    listFaculty({ limit: 100 }),
    listStaff({ limit: 100 }),
    listStaffCategories(),
    listFacultyDepartments(),
    getUnreadCount(),
  ]);

  // Use meta.total for accurate counts (not data.length which is page-limited)
  const publishedNotices = totalOf(noticesRes);
  const programs = totalOf(programsRes);
  const galleryAlbums = totalOf(galleryRes);
  const facultyMembers = totalOf(facultyRes);
  const staffMembers = totalOf(staffRes);
  const categories =
    (staffCategoriesRes?.data?.length ?? 0) + (facultyDepartmentsRes?.data?.length ?? 0);

  const admissionStatus = {
    pending: pendingRes.meta?.total ?? 0,
    under_review: reviewRes.meta?.total ?? 0,
    approved: approvedRes.meta?.total ?? 0,
    rejected: rejectedRes.meta?.total ?? 0,
  };

  // Count unread contacts from the fetched page (limit 100 should cover most cases)
  const unreadContacts = contactsRes.data?.filter((c) => !c.isRead)?.length
    ?? contactsRes.meta?.total ?? 0;

  const metricTrends = {
    pendingAdmissions: trendOf(pendingListRes.data ?? [], (item) => item.createdAt),
    unreadContacts: trendOf(
      (contactsRes.data ?? []).filter((contact) => !contact.isRead),
      (item) => item.createdAt
    ),
    publishedNotices: trendOf(
      (noticesRes.data ?? []).filter((notice) => notice.published !== false),
      (item) => item.publishedAt ?? item.createdAt ?? item.updatedAt
    ),
    programs: trendOf(programsListRes.data ?? [], (item) => item.createdAt),
    galleryAlbums: trendOf(galleryRes.data ?? [], (item) => item.createdAt),
    facultyMembers: trendOf(facultyRes.data ?? [], (item) => item.createdAt),
    staffMembers: trendOf(staffRes.data ?? [], (item) => item.createdAt),
    categories: trendOf(
      [...(staffCategoriesRes?.data ?? []), ...(facultyDepartmentsRes?.data ?? [])],
      (item) => item.createdAt
    ),
  };

  return {
    pendingAdmissions: admissionStatus.pending,
    unreadContacts,
    publishedNotices,
    programs,
    galleryAlbums,
    facultyMembers,
    staffMembers,
    categories,
    unreadNotifications,
    metricTrends,
    recentActivities: buildRecentActivities({
      admissions: recentAdmissionsRes.data ?? [],
      contacts: contactsRes.data ?? [],
      notices: noticesRes.data ?? [],
    }),
    charts: {
      admissionStatus,
      contentDistribution: {
        Notices: publishedNotices,
        Programs: programs,
        Gallery: galleryAlbums,
        Faculty: facultyMembers,
        Staff: staffMembers,
      },
      admissionsTrend: buildMonthlyTrend(recentAdmissionsRes.data ?? []),
      contactTrends: buildWeeklyContactTrend(contactsRes.data ?? []),
      programsDistribution: buildProgramsDistribution(
        recentAdmissionsRes.data ?? [],
        programsListRes.data ?? []
      ),
    },
  };
}
