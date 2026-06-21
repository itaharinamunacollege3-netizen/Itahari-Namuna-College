import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Images,
  Mail,
  Megaphone,
  Tags,
  Upload,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TableSkeleton } from "@/components/ui/Skeleton";
import {
  AdmissionStatusPie,
  AdmissionsLineChart,
  ContactTrendsArea,
  ProgramsDistributionBar,
} from "@/components/dashboard/DashboardCharts";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { fetchDashboardStats } from "@/services/dashboard.service";

const statCards = [
  { key: "pendingAdmissions", label: "Pending Admissions", icon: ClipboardList, chip: "bg-emerald-100 text-emerald-700" },
  { key: "unreadContacts", label: "Unread Contacts", icon: Mail, chip: "bg-rose-100 text-rose-600" },
  { key: "publishedNotices", label: "Published Notices", icon: Megaphone, chip: "bg-sky-100 text-sky-700" },
  { key: "programs", label: "Programs", icon: BookOpen, chip: "bg-amber-100 text-amber-700" },
  { key: "galleryAlbums", label: "Gallery Albums", icon: Images, chip: "bg-pink-100 text-pink-700" },
  { key: "facultyMembers", label: "Faculty Members", icon: Users, chip: "bg-emerald-100 text-emerald-700" },
  { key: "staffMembers", label: "Staff Members", icon: Briefcase, chip: "bg-sky-100 text-sky-700" },
  { key: "categories", label: "Categories", icon: Tags, chip: "bg-amber-100 text-amber-700" },
];

export default function DashboardPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const quickActions = [
    { label: "New Notice", to: "/notices", icon: Megaphone },
    { label: "Add Program", to: "/programs", icon: BookOpen },
    { label: "Upload Gallery", to: "/gallery", icon: Upload },
    { label: "View Admissions", to: "/admissions", icon: GraduationCap },
  ];

  const formatRelativeTime = (dateLike) => {
    if (!dateLike) return "";
    const date = new Date(dateLike);
    if (Number.isNaN(date.getTime())) return "";

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of college CMS activity"
      />

      {error ? (
        <div className="alert alert-error">{error}</div>
      ) : loading ? (
        <TableSkeleton rows={3} />
      ) : (
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-3xl border border-emerald-700/40 bg-linear-to-r from-emerald-800 via-emerald-900 to-emerald-700 p-6 shadow-lg shadow-emerald-900/20 sm:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(74,222,128,0.2),transparent_28%)]" />
            <div className="relative">
              <p className="text-sm font-medium text-emerald-100/90">{today}</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-[2.15rem]">
                Welcome back, {user?.name ?? "Administrator"}
              </h2>
              <p className="mt-1 text-sm text-emerald-100/85 sm:text-base">
                Here&apos;s what&apos;s happening at Itahari Namuna College today.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {quickActions.map(({ label, to, icon: Icon }) => (
                  <Link
                    key={label}
                    to={to}
                    className="flex h-[72px] w-[128px] flex-col items-start justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-white backdrop-blur-xs transition hover:bg-white/15"
                  >
                    <Icon className="h-3.5 w-3.5 opacity-90" />
                    <span className="text-[13px] leading-[1.1rem] font-semibold tracking-[0.01em]">
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ key, label, icon: Icon, chip }) => (
              <div key={key} className="card-surface rounded-2xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-[var(--text-muted)]">{label}</p>
                    <p className="mt-1 text-4xl font-bold tracking-tight text-[var(--color-brand-dark)]">
                      {stats?.[key] ?? 0}
                    </p>
                  </div>
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${chip}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                {(() => {
                  const trend = stats?.metricTrends?.[key];
                  const percent = Number(trend?.percent ?? 0);
                  const isPositive = percent >= 0;
                  const sign = isPositive ? "+" : "";
                  const chipClass = isPositive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300";

                  return (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px]">
                      <span className={`rounded-full px-2 py-0.5 font-semibold ${chipClass}`}>
                        {sign}
                        {percent}%
                      </span>
                      <span className="text-[var(--text-muted)]">vs last month</span>
                    </div>
                  );
                })()}
              </div>
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-3">
            <section className="card-surface p-5 xl:col-span-2">
              <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">
                Monthly Admissions
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Applications received over the last year
              </p>
              <div className="mt-4">
                {stats?.charts?.admissionsTrend ? (
                  <AdmissionsLineChart data={stats.charts.admissionsTrend} isDark={isDark} />
                ) : (
                  <p className="flex h-[280px] items-center justify-center text-sm text-[var(--text-muted)]">No data</p>
                )}
              </div>
            </section>

            <section className="card-surface p-5 xl:col-span-1">
              <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">
                Admission Status
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Current breakdown
              </p>
              <div className="mt-4">
                {stats?.charts?.admissionStatus ? (
                  <AdmissionStatusPie data={stats.charts.admissionStatus} isDark={isDark} />
                ) : (
                  <p className="flex h-[280px] items-center justify-center text-sm text-[var(--text-muted)]">No data</p>
                )}
              </div>
            </section>

            <section className="card-surface p-5 xl:col-span-1">
              <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">
                Programs Distribution
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Active application count by program
              </p>
              <div className="mt-4">
                {stats?.charts?.programsDistribution ? (
                  <ProgramsDistributionBar data={stats.charts.programsDistribution} isDark={isDark} />
                ) : (
                  <p className="flex h-[280px] items-center justify-center text-sm text-[var(--text-muted)]">No data</p>
                )}
              </div>
            </section>

            <section className="card-surface p-5 xl:col-span-2">
              <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">
                Contact Trends
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Inquiry messages by week
              </p>
              <div className="mt-4">
                {stats?.charts?.contactTrends ? (
                  <ContactTrendsArea data={stats.charts.contactTrends} isDark={isDark} />
                ) : (
                  <p className="flex h-[280px] items-center justify-center text-sm text-[var(--text-muted)]">No data</p>
                )}
              </div>
            </section>

            <section className="card-surface p-5 xl:col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">Recent Activity</h2>
                <Link to="/notifications" className="text-sm font-semibold text-[var(--color-brand-primary)]">
                  View all
                </Link>
              </div>

              <div className="mt-4 divide-y divide-[var(--border-subtle)]">
                {(stats?.recentActivities ?? []).length ? (
                  stats.recentActivities.map((activity) => (
                    <Link
                      key={activity.id}
                      to={activity.path}
                      className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-brand-dark)]">
                          {activity.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                          {activity.description}
                        </p>
                      </div>
                      <p className="shrink-0 text-xs text-[var(--text-muted)]">
                        {formatRelativeTime(activity.at)}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">No recent activities yet.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
