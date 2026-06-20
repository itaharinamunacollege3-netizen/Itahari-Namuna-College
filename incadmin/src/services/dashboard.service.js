import { listAdmissions } from "./admissions.service";
import { listContacts } from "./contacts.service";
import { listNotices } from "./notices.service";
import { listPrograms } from "./programs.service";
import { listGalleryAlbums } from "./gallery.service";
import { listFaculty } from "./faculty.service";
import { listStaff } from "./staff.service";
import { getUnreadCount } from "./notifications.service";

const ADMISSION_STATUSES = ["pending", "under_review", "approved", "rejected"];

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

export async function fetchDashboardStats() {
  const [
    pendingRes,
    reviewRes,
    approvedRes,
    rejectedRes,
    recentAdmissionsRes,
    contactsRes,
    noticesRes,
    programsRes,
    galleryRes,
    facultyRes,
    staffRes,
    unreadNotifications,
  ] = await Promise.all([
    ...ADMISSION_STATUSES.map((status) => listAdmissions({ status, limit: 1 })),
    listAdmissions({ limit: 100 }),
    listContacts(1, 50),
    listNotices({ limit: 1 }),
    listPrograms({ limit: 1 }),
    listGalleryAlbums(),
    listFaculty(),
    listStaff(),
    getUnreadCount(),
  ]);

  const publishedNotices = noticesRes.meta?.total ?? noticesRes.data.length;
  const programs = programsRes.meta?.total ?? programsRes.data.length;
  const galleryAlbums = galleryRes.data.length;
  const facultyMembers = facultyRes.data.length;
  const staffMembers = staffRes.data.length;

  const admissionStatus = {
    pending: pendingRes.meta?.total ?? 0,
    under_review: reviewRes.meta?.total ?? 0,
    approved: approvedRes.meta?.total ?? 0,
    rejected: rejectedRes.meta?.total ?? 0,
  };

  return {
    pendingAdmissions: admissionStatus.pending,
    unreadContacts: contactsRes.data.filter((c) => !c.isRead).length,
    publishedNotices,
    programs,
    galleryAlbums,
    facultyMembers,
    staffMembers,
    unreadNotifications,
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
    },
  };
}
