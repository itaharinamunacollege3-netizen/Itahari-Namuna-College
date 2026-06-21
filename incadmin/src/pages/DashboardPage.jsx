import { useEffect, useState } from "react";
import {
  Briefcase,
  ClipboardList,
  GraduationCap,
  Images,
  Mail,
  Megaphone,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TableSkeleton } from "@/components/ui/Skeleton";
import {
  AdmissionStatusPie,
  AdmissionsBarChart,
  ContentDistributionPie,
} from "@/components/dashboard/DashboardCharts";
import { useTheme } from "@/contexts/ThemeContext";
import { fetchDashboardStats } from "@/services/dashboard.service";

const statCards = [
  { key: "pendingAdmissions", label: "Pending Admissions", icon: ClipboardList, color: "text-amber-600" },
  { key: "unreadContacts", label: "Unread Contacts", icon: Mail, color: "text-sky-600" },
  { key: "publishedNotices", label: "Notices", icon: Megaphone, color: "text-emerald-600" },
  { key: "programs", label: "Programs", icon: GraduationCap, color: "text-violet-600" },
  { key: "galleryAlbums", label: "Gallery Albums", icon: Images, color: "text-orange-600" },
  { key: "facultyMembers", label: "Faculty", icon: Users, color: "text-rose-600" },
  { key: "staffMembers", label: "Staff", icon: Briefcase, color: "text-teal-600" },
];

export default function DashboardPage() {
  const { theme } = useTheme();
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {statCards.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="card-surface p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">{label}</p>
                    <p className="mt-2 text-3xl font-bold text-[var(--color-brand-dark)]">
                      {stats?.[key] ?? 0}
                    </p>
                  </div>
                  <div className={`rounded-xl bg-slate-100 p-3 dark:bg-white/5 ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="card-surface p-5">
              <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">
                Admissions Trend
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Monthly applications over the last 6 months
              </p>
              <div className="mt-4">
                {stats?.charts?.admissionsTrend ? (
                  <AdmissionsBarChart data={stats.charts.admissionsTrend} isDark={isDark} />
                ) : (
                  <p className="flex h-[280px] items-center justify-center text-sm text-[var(--text-muted)]">No data</p>
                )}
              </div>
            </section>

            <section className="card-surface p-5">
              <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">
                Admission Status
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Breakdown by review status
              </p>
              <div className="mt-4">
                {stats?.charts?.admissionStatus ? (
                  <AdmissionStatusPie data={stats.charts.admissionStatus} isDark={isDark} />
                ) : (
                  <p className="flex h-[280px] items-center justify-center text-sm text-[var(--text-muted)]">No data</p>
                )}
              </div>
            </section>

            <section className="card-surface p-5 xl:col-span-2">
              <h2 className="text-lg font-bold text-[var(--color-brand-dark)]">
                Content Overview
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Published items across CMS modules
              </p>
              <div className="mx-auto mt-4 max-w-xl">
                {stats?.charts?.contentDistribution ? (
                  <ContentDistributionPie data={stats.charts.contentDistribution} isDark={isDark} />
                ) : (
                  <p className="flex h-[280px] items-center justify-center text-sm text-[var(--text-muted)]">No data</p>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
