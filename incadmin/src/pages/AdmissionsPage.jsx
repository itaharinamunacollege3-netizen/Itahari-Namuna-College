import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Download, Eye, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Modal, FormField, FormTextarea, FormActions } from "@/components/ui/Modal";
import { ADMISSION_FILTERS } from "@/constants/theme";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  exportAdmissionsCsv,
  getAdmission,
  listAdmissions,
  updateAdmissionStatus,
} from "@/services/admissions.service";
import { formatDate, formatProgram } from "@/utils/format";
import { cn } from "@/utils/cn";

export default function AdmissionsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [detailId, setDetailId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [detailStatus, setDetailStatus] = useState("pending");
  const [saving, setSaving] = useState(false);

  const params = useMemo(
    () => ({
      page,
      limit: 50,
      search: search || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
    }),
    [page, search, statusFilter]
  );

  const { data, meta, loading, error, reload } = useAsyncData(
    () => listAdmissions(params),
    [page, search, statusFilter]
  );

  async function handleExport() {
    try {
      const blob = await exportAdmissionsCsv({
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `admissions-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch {
      toast.error("Export failed");
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await updateAdmissionStatus(id, status);
      toast.success("Status updated");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function openDetail(id) {
    try {
      const { data: admission } = await getAdmission(id);
      setDetail(admission);
      setDetailId(id);
      setAdminNotes(admission.adminNotes ?? "");
      setDetailStatus(admission.status ?? "pending");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load application");
    }
  }

  async function handleDetailSave(e) {
    e.preventDefault();
    if (!detailId) return;
    setSaving(true);
    try {
      await updateAdmissionStatus(detailId, detailStatus, adminNotes);
      toast.success("Application updated");
      setDetailId(null);
      setDetail(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Admissions"
        subtitle="Manage student admission applications"
        actions={
          <button type="button" className="btn btn-sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      <div className="card-surface p-4">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {ADMISSION_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setStatusFilter(key);
                  setPage(1);
                }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  statusFilter === key
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <form
            className="relative w-full max-w-sm"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchInput.trim());
              setPage(1);
            }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input input-bordered w-full pl-10"
              placeholder="Search name, email, phone…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>

        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : loading ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-xs uppercase text-slate-500">
                    <th>Applicant</th>
                    <th>Program</th>
                    <th>Phone</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length ? (
                    data.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td>
                          <p className="font-medium">{row.fullName}</p>
                          <p className="text-xs text-slate-500">{row.email}</p>
                        </td>
                        <td>{formatProgram(row.programApplied)}</td>
                        <td>{row.phone}</td>
                        <td>{formatDate(row.createdAt)}</td>
                        <td>
                          <StatusBadge status={row.status} />
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button type="button" className="btn btn-ghost btn-xs" onClick={() => openDetail(row.id)}>
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <select
                              className="select select-bordered select-xs"
                              value={row.status}
                              onChange={(e) => handleStatusChange(row.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="under_review">Review</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-500">
                        No admissions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal open={Boolean(detailId)} title="Application Details" onClose={() => { setDetailId(null); setDetail(null); }} wide>
        {detail ? (
          <form onSubmit={handleDetailSave} className="space-y-4">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-slate-500">Full name</dt><dd className="font-medium">{detail.fullName}</dd></div>
              <div><dt className="text-slate-500">Email</dt><dd className="font-medium">{detail.email}</dd></div>
              <div><dt className="text-slate-500">Phone</dt><dd className="font-medium">{detail.phone}</dd></div>
              <div><dt className="text-slate-500">Gender</dt><dd className="font-medium capitalize">{detail.gender}</dd></div>
              <div><dt className="text-slate-500">Program</dt><dd className="font-medium">{formatProgram(detail.programApplied)}</dd></div>
              <div><dt className="text-slate-500">Session</dt><dd className="font-medium">{detail.session}</dd></div>
              <div><dt className="text-slate-500">Plus 2 stream</dt><dd className="font-medium">{detail.plus2Stream ?? "—"}</dd></div>
              <div><dt className="text-slate-500">Applied</dt><dd className="font-medium">{formatDate(detail.createdAt)}</dd></div>
              <div className="sm:col-span-2"><dt className="text-slate-500">Address</dt><dd className="font-medium">{detail.address}</dd></div>
            </dl>
            <FormField label="Status">
              <select className="select select-bordered w-full rounded-xl" value={detailStatus} onChange={(e) => setDetailStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="under_review">Under review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </FormField>
            <FormField label="Admin notes">
              <FormTextarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
            </FormField>
            <FormActions onCancel={() => { setDetailId(null); setDetail(null); }} loading={saving} submitLabel="Save changes" />
          </form>
        ) : (
          <span className="loading loading-spinner" />
        )}
      </Modal>
    </div>
  );
}
