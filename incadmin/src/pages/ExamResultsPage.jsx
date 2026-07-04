import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Plus, Upload, Eye, CheckCircle, UploadCloud, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableEmpty,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/ui/DataTable";
import {
  Modal,
  FormField,
  FormInput,
  FormSelect,
  FormSection,
  FormActions,
} from "@/components/ui/Modal";
import { useAsyncData } from "@/hooks/useAsyncData";
import { examResultService } from "@/services/examResult.service";

const emptyForm = {
  examName: "",
  examType: "PLUS2_ENTRANCE",
  program: "",
  examDate: "",
};

export default function ExamResultsPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Upload & Preview Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [committing, setCommitting] = useState(false);
  const fileInputRef = useRef(null);

  const { data: sessions, loading, error, reload } = useAsyncData(
    () => examResultService.listSessions(),
    []
  );

  function openCreate() {
    setForm(emptyForm);
    setOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.examName.trim().length < 3) {
      toast.error("Exam Name must be at least 3 characters");
      return;
    }
    if (!form.program.trim()) {
      toast.error("Program is required");
      return;
    }
    if (!form.examDate) {
      toast.error("Exam Date is required");
      return;
    }

    setSaving(true);
    try {
      await examResultService.createSession({
        examName: form.examName.trim(),
        examType: form.examType,
        program: form.program.trim(),
        examDate: new Date(form.examDate).toISOString(),
      });
      toast.success("Exam session created");
      setOpen(false);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(session) {
    try {
      await examResultService.togglePublish(session.id, !session.isPublished);
      toast.success(`Session ${session.isPublished ? "unpublished" : "published"}`);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  function openUpload(session) {
    setActiveSession(session);
    setPreviewData(null);
    setUploadModalOpen(true);
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await examResultService.uploadExcel(activeSession.id, file);
      setPreviewData(res);
      toast.success("File parsed successfully. Please review below.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleCommit() {
    if (!activeSession) return;
    setCommitting(true);
    try {
      const res = await examResultService.commitImport(activeSession.id);
      toast.success(`Imported ${res.imported} valid results.`);
      setUploadModalOpen(false);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCommitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Results"
        subtitle="Manage and publish student exam results"
        actions={
          <Button type="button" size="sm" variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Create Session
          </Button>
        }
      />

      <Card className="p-4">
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : loading ? (
          <TableSkeleton />
        ) : (
          <DataTable>
            <DataTableHead>
              <DataTableRow className="text-xs uppercase text-[var(--text-muted)]">
                <DataTableHeaderCell>Exam Details</DataTableHeaderCell>
                <DataTableHeaderCell>Program</DataTableHeaderCell>
                <DataTableHeaderCell>Results</DataTableHeaderCell>
                <DataTableHeaderCell>Status</DataTableHeaderCell>
                <DataTableHeaderCell>Actions</DataTableHeaderCell>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {sessions?.length ? (
                sessions.map((session) => (
                  <DataTableRow key={session.id}>
                    <DataTableCell>
                      <p className="font-medium">{session.examName}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Date(session.examDate).toLocaleDateString()}
                      </p>
                    </DataTableCell>
                    <DataTableCell>
                      <span className="badge badge-ghost badge-sm">{session.program}</span>
                    </DataTableCell>
                    <DataTableCell>
                      <span className="font-semibold text-lg">{session._count.results}</span>
                    </DataTableCell>
                    <DataTableCell>
                      <div className="flex gap-2 items-center">
                        {session.isPublished ? (
                          <span className="badge badge-success badge-sm gap-1">
                            <CheckCircle className="h-3 w-3" /> Published
                          </span>
                        ) : (
                          <span className="badge badge-ghost badge-sm">Draft</span>
                        )}
                        <input
                          type="checkbox"
                          className="toggle toggle-sm toggle-success"
                          checked={session.isPublished}
                          onChange={() => togglePublish(session)}
                        />
                      </div>
                    </DataTableCell>
                    <DataTableCell>
                      <Button
                        type="button"
                        size="xs"
                        variant="secondary"
                        onClick={() => openUpload(session)}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Manage Results
                      </Button>
                    </DataTableCell>
                  </DataTableRow>
                ))
              ) : (
                <DataTableEmpty colSpan={5}>No exam sessions found</DataTableEmpty>
              )}
            </DataTableBody>
          </DataTable>
        )}
      </Card>

      {/* Create Session Modal */}
      <Modal
        open={open}
        title="Create Exam Session"
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection>
            <FormField label="Exam Name *">
              <FormInput
                value={form.examName}
                onChange={(e) => setForm({ ...form, examName: e.target.value })}
                placeholder="e.g. BCA First Semester Final Exam 2024"
                required
              />
            </FormField>
            
            <FormField label="Exam Type *">
              <FormSelect
                value={form.examType}
                onChange={(e) => setForm({ ...form, examType: e.target.value })}
                required
              >
                <option value="PLUS2_ENTRANCE">+2 Entrance</option>
                <option value="BACHELOR_ENTRANCE">Bachelor Entrance</option>
              </FormSelect>
            </FormField>

            <FormField label="Program *">
              <FormInput
                value={form.program}
                onChange={(e) => setForm({ ...form, program: e.target.value })}
                placeholder="e.g. BCA"
                required
              />
            </FormField>

            <FormField label="Exam Date *">
              <FormInput
                type="date"
                value={form.examDate}
                onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                required
              />
            </FormField>
          </FormSection>
          <FormActions onCancel={() => setOpen(false)} loading={saving} submitLabel="Create" />
        </form>
      </Modal>

      {/* Upload & Preview Modal */}
      <Modal
        open={uploadModalOpen}
        title={`Results: ${activeSession?.examName || ""}`}
        onClose={() => setUploadModalOpen(false)}
        wide="4xl"
      >
        <div className="space-y-6">
          {!previewData ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--border-subtle)] rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] transition-colors">
              <UploadCloud className="h-10 w-10 text-[var(--text-muted)] mb-4" />
              <h3 className="text-lg font-medium">Upload Excel Sheet</h3>
              <p className="text-sm text-[var(--text-muted)] text-center max-w-sm mb-4">
                The Excel file must contain columns: SymbolNumber, StudentName, Program, ObtainedMarks, TotalMarks, Status.
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Select File"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900">Upload Summary</h4>
                  <div className="flex gap-4 mt-1 text-sm text-blue-800">
                    <span>Total Rows: {previewData.summary.total}</span>
                    <span className="text-green-700">Valid: {previewData.summary.valid}</span>
                    {previewData.summary.invalid > 0 && (
                      <span className="text-red-600 font-medium">Invalid: {previewData.summary.invalid}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setPreviewData(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleCommit}
                    disabled={previewData.summary.valid === 0 || committing}
                  >
                    {committing ? "Importing..." : `Commit ${previewData.summary.valid} Valid Rows`}
                  </Button>
                </div>
              </div>

              <div className="border border-[var(--border-subtle)] rounded-lg overflow-hidden max-h-[50vh] overflow-y-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[var(--bg-subtle)] sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 font-medium">Row</th>
                      <th className="px-4 py-3 font-medium">Symbol Number</th>
                      <th className="px-4 py-3 font-medium">Student Name</th>
                      <th className="px-4 py-3 font-medium">Program</th>
                      <th className="px-4 py-3 font-medium text-right">Marks</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium w-full">Issues</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {previewData.rows.map((row, i) => {
                      const hasErrors = row.errors && row.errors.length > 0;
                      return (
                        <tr key={i} className={hasErrors ? "bg-red-50/30" : ""}>
                          <td className="px-4 py-3 text-[var(--text-muted)]">{row.rowIndex}</td>
                          <td className="px-4 py-3 font-medium">{row.symbolNumber}</td>
                          <td className="px-4 py-3">{row.studentName}</td>
                          <td className="px-4 py-3">{row.program}</td>
                          <td className="px-4 py-3 text-right">
                            {row.obtainedMarks} / {row.totalMarks}
                            <span className="ml-2 text-xs text-[var(--text-muted)]">
                              ({row.percentage}%)
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`badge badge-sm ${
                              row.status === "PASS" ? "badge-success" :
                              row.status === "FAIL" ? "badge-error" : "badge-warning"
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {hasErrors ? (
                              <div className="flex flex-col gap-1 text-xs text-red-600">
                                {row.errors.map((err, errIdx) => (
                                  <div key={errIdx} className="flex items-start gap-1">
                                    <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                                    <span className="truncate max-w-[200px]" title={err}>{err}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Valid
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
