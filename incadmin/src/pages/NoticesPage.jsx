import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormHint,
  FormSection,
  FormActions,
} from "@/components/ui/Modal";
import {
  NOTICE_AUDIENCES,
  NOTICE_CATEGORIES,
  NOTICE_FIELD_HINTS,
} from "@/constants/notices";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  createNotice,
  deleteNotice,
  getNotice,
  listNotices,
  removeNoticeImage,
  removeNoticePdf,
  updateNotice,
} from "@/services/notices.service";
import { optionalString } from "@/utils/formHelpers";
import { formatDate } from "@/utils/format";

const emptyForm = {
  title: "",
  description: "",
  publishedDate: new Date().toISOString().slice(0, 10),
  category: "General",
  tags: "",
  audience: "All Programs",
  author: "",
  slug: "",
  pdfUrl: "",
  featured: false,
  published: true,
  removePdf: false,
  removeImage: false,
  pdf: null,
  image: null,
};

function toForm(notice) {
  return {
    title: notice.title ?? "",
    description: notice.description ?? "",
    publishedDate: notice.publishedDate?.slice(0, 10) ?? "",
    category: notice.category ?? "General",
    tags: Array.isArray(notice.tags) ? notice.tags.join(", ") : "",
    audience: notice.audience ?? "",
    author: notice.author ?? "",
    slug: notice.slug ?? "",
    pdfUrl: notice.pdfUrl ?? "",
    featured: Boolean(notice.featured),
    published: notice.published !== false,
    removePdf: false,
    removeImage: false,
    pdf: null,
    image: null,
  };
}

function toPayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    publishedDate: form.publishedDate,
    category: form.category.trim(),
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    audience: optionalString(form.audience),
    author: optionalString(form.author),
    slug: optionalString(form.slug),
    pdfUrl: optionalString(form.pdfUrl) ?? "",
    featured: form.featured,
    published: form.published,
    removePdf: form.removePdf,
    removeImage: form.removeImage,
  };
}

export default function NoticesPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsyncData(
    () => listNotices({ limit: 50 }),
    []
  );

  function openCreate() {
    setEditId(null);
    setExisting(null);
    setForm(emptyForm);
    setOpen(true);
  }

  async function openEdit(id) {
    try {
      const { data: notice } = await getNotice(id);
      setEditId(id);
      setExisting(notice);
      setForm(toForm(notice));
      setOpen(true);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.publishedDate)) {
      toast.error("Published date must use YYYY-MM-DD format");
      return;
    }
    if (!form.category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (form.pdfUrl.trim() && !/^https?:\/\/.+/i.test(form.pdfUrl.trim())) {
      toast.error("PDF URL must be a valid http or https link");
      return;
    }

    setSaving(true);
    const payload = toPayload(form);
    const files = { pdf: form.pdf, image: form.image };

    try {
      if (editId) {
        await updateNotice(editId, payload, files);
        toast.success("Notice updated");
      } else {
        await createNotice(payload, files);
        toast.success("Notice created");
      }
      setOpen(false);
      setForm(emptyForm);
      setEditId(null);
      setExisting(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this notice?")) return;
    try {
      await deleteNotice(id);
      toast.success("Notice deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleRemovePdf() {
    if (!editId || !confirm("Remove PDF attachment?")) return;
    try {
      await removeNoticePdf(editId);
      toast.success("PDF removed");
      const { data: notice } = await getNotice(editId);
      setExisting(notice);
      setForm((prev) => ({ ...prev, pdfUrl: "", removePdf: false }));
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleRemoveImage() {
    if (!editId || !confirm("Remove image attachment?")) return;
    try {
      await removeNoticeImage(editId);
      toast.success("Image removed");
      const { data: notice } = await getNotice(editId);
      setExisting(notice);
      setForm((prev) => ({ ...prev, removeImage: false }));
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Notices"
        subtitle="College notices and announcements"
        actions={
          <Button type="button" size="sm" variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Notice
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
                <DataTableHeaderCell>Title</DataTableHeaderCell>
                <DataTableHeaderCell>Category</DataTableHeaderCell>
                <DataTableHeaderCell>Audience</DataTableHeaderCell>
                <DataTableHeaderCell>Date</DataTableHeaderCell>
                <DataTableHeaderCell>Status</DataTableHeaderCell>
                <DataTableHeaderCell />
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {data?.length ? (
                data.map((row) => (
                  <DataTableRow key={row.id}>
                    <DataTableCell>
                        <p className="font-medium">{row.title}</p>
                        <p className="text-xs text-[var(--text-muted)] line-clamp-1">{row.description}</p>
                        {row.tags?.length ? (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {row.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="badge badge-ghost badge-xs">{tag}</span>
                            ))}
                          </div>
                        ) : null}
                    </DataTableCell>
                    <DataTableCell>{row.category ?? "—"}</DataTableCell>
                    <DataTableCell>{row.audience ?? "—"}</DataTableCell>
                    <DataTableCell>{formatDate(row.publishedDate)}</DataTableCell>
                    <DataTableCell>
                        <div className="flex flex-wrap gap-1">
                          {row.published ? (
                            <span className="badge badge-success badge-sm">Live</span>
                          ) : (
                            <span className="badge badge-ghost badge-sm">Draft</span>
                          )}
                          {row.featured ? (
                            <span className="badge badge-warning badge-sm">Featured</span>
                          ) : null}
                        </div>
                    </DataTableCell>
                    <DataTableCell>
                        <div className="flex gap-1">
                          <Button type="button" size="xs" variant="ghost" onClick={() => openEdit(row.id)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" size="xs" variant="danger" onClick={() => handleDelete(row.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                    </DataTableCell>
                  </DataTableRow>
                ))
              ) : (
                <DataTableEmpty colSpan={6}>No notices found</DataTableEmpty>
              )}
            </DataTableBody>
          </DataTable>
        )}
      </Card>

      <Modal open={open} title={editId ? "Edit Notice" : "Create Notice"} onClose={() => setOpen(false)} wide="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection title="Required fields (backend: createNoticeSchema)">
            <FormField label="Title *">
              <FormInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                minLength={3}
                required
              />
              <FormHint>{NOTICE_FIELD_HINTS.title}</FormHint>
            </FormField>

            <FormField label="Description / content *">
              <FormTextarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                required
              />
              <FormHint>{NOTICE_FIELD_HINTS.description}</FormHint>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Published date *">
                <FormInput
                  type="date"
                  value={form.publishedDate}
                  onChange={(e) => setForm({ ...form, publishedDate: e.target.value })}
                  pattern="\d{4}-\d{2}-\d{2}"
                  required
                />
                <FormHint>{NOTICE_FIELD_HINTS.publishedDate}</FormHint>
              </FormField>

              <FormField label="Category *">
                <FormSelect
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                >
                  {NOTICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </FormSelect>
                <FormHint>{NOTICE_FIELD_HINTS.category}</FormHint>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Optional metadata">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Author">
                <FormInput
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Examination Controller"
                />
              </FormField>

              <FormField label="Audience">
                <FormSelect
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                >
                  <option value="">— None —</option>
                  {NOTICE_AUDIENCES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </FormSelect>
              </FormField>
            </div>

            <FormField label="Tags">
              <FormInput
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="IMPORTANT, TU Exams"
              />
              <FormHint>{NOTICE_FIELD_HINTS.tags}</FormHint>
            </FormField>

            <FormField label="Slug">
              <FormInput
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="semester-exam-routine-2080"
              />
              <FormHint>{NOTICE_FIELD_HINTS.slug}</FormHint>
            </FormField>
          </FormSection>

          <FormSection title="Attachments (PDF & image)">
            <FormField label="PDF URL">
              <FormInput
                type="url"
                value={form.pdfUrl}
                onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
                placeholder="https://example.com/notice.pdf"
              />
              <FormHint>{NOTICE_FIELD_HINTS.pdfUrl}</FormHint>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Upload PDF file">
                <input
                  type="file"
                  accept="application/pdf"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setForm({ ...form, pdf: e.target.files?.[0] ?? null })}
                />
                <FormHint>Field name: pdf — replaces URL upload when provided</FormHint>
              </FormField>

              <FormField label="Upload image file">
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setForm({ ...form, image: e.target.files?.[0] ?? null })}
                />
                <FormHint>Field name: image — notice banner/thumbnail</FormHint>
              </FormField>
            </div>

            {editId && existing ? (
              <div className="space-y-3 rounded-lg border border-[var(--border-subtle)] p-3">
                <p className="text-sm font-medium">Current attachments</p>
                {existing.pdfUrl ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={existing.pdfUrl} target="_blank" rel="noreferrer" className="link link-primary text-sm">View PDF</a>
                    <button type="button" className="btn btn-xs btn-ghost text-rose-600" onClick={handleRemovePdf}>Remove PDF</button>
                    <FormCheckbox
                      label="Remove PDF on save (removePdf)"
                      checked={form.removePdf}
                      onChange={(e) => setForm({ ...form, removePdf: e.target.checked })}
                    />
                  </div>
                ) : null}
                {existing.imageUrl ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <img src={existing.imageUrl} alt="" className="h-12 w-12 rounded object-cover" />
                    <button type="button" className="btn btn-xs btn-ghost text-rose-600" onClick={handleRemoveImage}>Remove image</button>
                    <FormCheckbox
                      label="Remove image on save (removeImage)"
                      checked={form.removeImage}
                      onChange={(e) => setForm({ ...form, removeImage: e.target.checked })}
                    />
                  </div>
                ) : null}
                {!existing.pdfUrl && !existing.imageUrl ? (
                  <p className="text-sm text-[var(--text-muted)]">No attachments yet</p>
                ) : null}
              </div>
            ) : null}
          </FormSection>

          <FormSection title="Visibility flags">
            <div className="space-y-3">
              <div>
                <FormCheckbox
                  label="Featured notice (featured / showInPopup)"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                <FormHint>{NOTICE_FIELD_HINTS.featured}</FormHint>
              </div>
              <div>
                <FormCheckbox
                  label="Published — visible on public website"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                <FormHint>{NOTICE_FIELD_HINTS.published}</FormHint>
              </div>
            </div>
          </FormSection>

          <FormActions onCancel={() => setOpen(false)} loading={saving} submitLabel={editId ? "Update" : "Create"} />
        </form>
      </Modal>
    </div>
  );
}
