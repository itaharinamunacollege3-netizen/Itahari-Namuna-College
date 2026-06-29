import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2, GripVertical } from "lucide-react";
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
  EMPTY_JOURNAL_SECTION,
  JOURNAL_ACCENT_COLORS,
  JOURNAL_FIELD_HINTS,
  JOURNAL_FIELDS,
} from "@/constants/journals";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  createJournal,
  deleteJournal,
  getJournal,
  listJournals,
  removeJournalCover,
  removeJournalPdf,
  updateJournal,
} from "@/services/journals.service";
import { optionalString } from "@/utils/formHelpers";
import { formatDate } from "@/utils/format";

const emptyForm = {
  title: "",
  abstract: "",
  field: "Social Sciences",
  authors: "",
  authorAffiliation: "",
  volume: "",
  year: String(new Date().getFullYear()),
  doi: "",
  keywords: "",
  accentColor: "#045d30",
  sections: [{ ...EMPTY_JOURNAL_SECTION }],
  calloutLabel: "",
  calloutBody: "",
  citeSuggestion: "",
  slug: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  sortOrder: 0,
  featured: false,
  isPopular: false,
  published: true,
  removeCover: false,
  removePdf: false,
  cover: null,
  pdf: null,
};

function sectionsToForm(sections) {
  if (!Array.isArray(sections) || !sections.length) {
    return [{ ...EMPTY_JOURNAL_SECTION }];
  }
  return sections.map((section) => ({
    heading: section.heading ?? "",
    body: section.body ?? "",
    bullets: Array.isArray(section.bullets) ? section.bullets.join(", ") : "",
    imageUrl: section.imageUrl ?? "",
    imageCloudinaryId: section.imageCloudinaryId ?? "",
    removeImage: false,
  }));
}

function toForm(entry) {
  return {
    title: entry.title ?? "",
    abstract: entry.abstract ?? "",
    field: entry.field ?? "Social Sciences",
    authors: Array.isArray(entry.authors) ? entry.authors.join(", ") : "",
    authorAffiliation: entry.authorAffiliation ?? "",
    volume: entry.volume ?? "",
    year: entry.year ?? String(new Date().getFullYear()),
    doi: entry.doi ?? "",
    keywords: Array.isArray(entry.keywords) ? entry.keywords.join(", ") : "",
    accentColor: entry.accentColor ?? "#045d30",
    sections: sectionsToForm(entry.sections),
    calloutLabel: entry.callout?.label ?? "",
    calloutBody: entry.callout?.body ?? "",
    citeSuggestion: entry.citeSuggestion ?? "",
    slug: entry.slug ?? "",
    publishedAt: entry.publishedAt?.slice?.(0, 10) ?? new Date().toISOString().slice(0, 10),
    sortOrder: entry.sortOrder ?? 0,
    featured: Boolean(entry.featured),
    isPopular: Boolean(entry.isPopular),
    published: entry.published !== false,
    removeCover: false,
    removePdf: false,
    cover: null,
    pdf: null,
  };
}

function toPayload(form) {
  const sections = form.sections
    .map((section) => {
      const heading = section.heading.trim();
      const body = section.body.trim();
      if (!heading || !body) return null;
      const bullets = section.bullets
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const base = {
        heading,
        body,
        ...(bullets.length ? { bullets } : {}),
        ...(section.imageUrl ? { imageUrl: section.imageUrl } : {}),
        ...(section.imageCloudinaryId ? { imageCloudinaryId: section.imageCloudinaryId } : {}),
        removeImage: section.removeImage,
      };
      return base;
    })
    .filter(Boolean);

  const calloutLabel = form.calloutLabel.trim();
  const calloutBody = form.calloutBody.trim();

  return {
    title: form.title.trim(),
    abstract: form.abstract.trim(),
    field: form.field.trim(),
    authors: form.authors
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean),
    authorAffiliation: optionalString(form.authorAffiliation),
    volume: form.volume.trim(),
    year: form.year.trim(),
    doi: optionalString(form.doi),
    keywords: form.keywords
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    accentColor: form.accentColor,
    sections,
    callout:
      calloutLabel && calloutBody ? { label: calloutLabel, body: calloutBody } : null,
    citeSuggestion: optionalString(form.citeSuggestion),
    slug: optionalString(form.slug),
    publishedAt: form.publishedAt,
    sortOrder: Number(form.sortOrder) || 0,
    featured: form.featured,
    isPopular: form.isPopular,
    published: form.published,
    removeCover: form.removeCover,
    removePdf: form.removePdf,
  };
}

export default function JournalsPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsyncData(
    () => listJournals({ limit: 50 }),
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
      const { data: entry } = await getJournal(id);
      setEditId(id);
      setExisting(entry);
      setForm(toForm(entry));
      setOpen(true);
    } catch (err) {
      toast.error(err.message);
    }
  }

  function updateSection(index, field, value) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  }

  function addSection() {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { ...EMPTY_JOURNAL_SECTION }],
    }));
  }

  function removeSection(index) {
    setForm((prev) => ({
      ...prev,
      sections:
        prev.sections.length <= 1
          ? [{ ...EMPTY_JOURNAL_SECTION }]
          : prev.sections.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (form.abstract.trim().length < 20) {
      toast.error("Abstract must be at least 20 characters");
      return;
    }
    if (!form.volume.trim()) {
      toast.error("Volume is required");
      return;
    }
    if (!/^\d{4}$/.test(form.year.trim())) {
      toast.error("Year must be a 4-digit value");
      return;
    }

    const payload = toPayload(form);
    if (!payload.authors.length) {
      toast.error("At least one author is required");
      return;
    }
    if (!payload.sections.length) {
      toast.error("At least one complete section is required");
      return;
    }

    setSaving(true);
    const files = { 
      cover: form.cover, 
      pdf: form.pdf,
      sectionImages: form.sections.map((section) => section.imageFile || null),
    };

    try {
      if (editId) {
        await updateJournal(editId, payload, files);
        toast.success("Journal entry updated");
      } else {
        await createJournal(payload, files);
        toast.success("Journal entry created");
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
    if (!confirm("Delete this journal entry?")) return;
    try {
      await deleteJournal(id);
      toast.success("Journal entry deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleRemoveCover() {
    if (!editId || !confirm("Remove cover image?")) return;
    try {
      await removeJournalCover(editId);
      toast.success("Cover removed");
      const { data: entry } = await getJournal(editId);
      setExisting(entry);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleRemovePdf() {
    if (!editId || !confirm("Remove PDF attachment?")) return;
    try {
      await removeJournalPdf(editId);
      toast.success("PDF removed");
      const { data: entry } = await getJournal(editId);
      setExisting(entry);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Journal"
        subtitle="Manage academic research papers on the public journal page"
        actions={
          <Button type="button" size="sm" variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Paper
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
                <DataTableHeaderCell>Field</DataTableHeaderCell>
                <DataTableHeaderCell>Volume</DataTableHeaderCell>
                <DataTableHeaderCell>Year</DataTableHeaderCell>
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
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1">{row.abstract}</p>
                      {row.authors?.length ? (
                        <p className="mt-1 text-xs text-[var(--text-muted)]">{row.authors.join(", ")}</p>
                      ) : null}
                    </DataTableCell>
                    <DataTableCell>{row.field}</DataTableCell>
                    <DataTableCell>{row.volume}</DataTableCell>
                    <DataTableCell>{row.year}</DataTableCell>
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
                        {row.isPopular ? (
                          <span className="badge badge-info badge-sm">Popular</span>
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
                <DataTableEmpty colSpan={6}>No journal entries found</DataTableEmpty>
              )}
            </DataTableBody>
          </DataTable>
        )}
      </Card>

      <Modal
        open={open}
        title={editId ? "Edit Journal Paper" : "Create Journal Paper"}
        onClose={() => setOpen(false)}
        wide="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection title="Paper information">
            <FormField label="Title *">
              <FormInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <FormHint>{JOURNAL_FIELD_HINTS.title}</FormHint>
            </FormField>

            <FormField label="Abstract *">
              <FormTextarea
                value={form.abstract}
                onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                rows={4}
                required
              />
              <FormHint>{JOURNAL_FIELD_HINTS.abstract}</FormHint>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Research field *">
                <FormSelect
                  value={form.field}
                  onChange={(e) => setForm({ ...form, field: e.target.value })}
                  required
                >
                  {JOURNAL_FIELDS.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </FormSelect>
              </FormField>

              <FormField label="Accent color">
                <FormSelect
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                >
                  {JOURNAL_ACCENT_COLORS.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Authors & publication">
            <FormField label="Authors *">
              <FormInput
                value={form.authors}
                onChange={(e) => setForm({ ...form, authors: e.target.value })}
                placeholder="Dr. Kamala Adhikari, Prof. Sunil Bhattarai"
                required
              />
              <FormHint>{JOURNAL_FIELD_HINTS.authors}</FormHint>
            </FormField>

            <FormField label="Author affiliation">
              <FormInput
                value={form.authorAffiliation}
                onChange={(e) => setForm({ ...form, authorAffiliation: e.target.value })}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Volume *">
                <FormInput
                  value={form.volume}
                  onChange={(e) => setForm({ ...form, volume: e.target.value })}
                  placeholder="Vol. 4, Issue 2"
                  required
                />
              </FormField>

              <FormField label="Year *">
                <FormInput
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  pattern="\d{4}"
                  required
                />
              </FormField>

              <FormField label="Published date">
                <FormInput
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="DOI">
              <FormInput
                value={form.doi}
                onChange={(e) => setForm({ ...form, doi: e.target.value })}
                placeholder="10.XXXXX/inc.journal.2025.04.02.001"
              />
            </FormField>

            <FormField label="Keywords">
              <FormInput
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder="STEM Education, Rural Nepal"
              />
              <FormHint>{JOURNAL_FIELD_HINTS.keywords}</FormHint>
            </FormField>

            <FormField label="Citation suggestion">
              <FormTextarea
                value={form.citeSuggestion}
                onChange={(e) => setForm({ ...form, citeSuggestion: e.target.value })}
                rows={3}
              />
            </FormField>

            <FormField label="Slug">
              <FormInput
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </FormField>
          </FormSection>

          <FormSection title="Paper sections">
            <div className="space-y-4">
              {form.sections.map((section, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-[var(--border-subtle)] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
                      <GripVertical className="h-4 w-4" />
                      Section {index + 1}
                    </div>
                    <Button type="button" size="xs" variant="ghost" onClick={() => removeSection(index)}>
                      Remove
                    </Button>
                  </div>

                  <FormField label="Heading *">
                    <FormInput
                      value={section.heading}
                      onChange={(e) => updateSection(index, "heading", e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Body *">
                    <FormTextarea
                      value={section.body}
                      onChange={(e) => updateSection(index, "body", e.target.value)}
                      rows={4}
                      required
                    />
                  </FormField>

                  <FormField label="Bullet points (comma-separated)">
                    <FormInput
                      value={section.bullets}
                      onChange={(e) => updateSection(index, "bullets", e.target.value)}
                    />
                  </FormField>

                  <FormField label="Section image">
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      onChange={(e) => updateSection(index, "imageFile", e.target.files?.[0] || null)}
                    />
                  </FormField>

                  {section.imageUrl ? (
                    <div className="space-y-2">
                      <img
                        src={section.imageUrl}
                        alt=""
                        className="h-40 w-full rounded object-cover"
                      />
                      <div className="flex items-center gap-2">
                        <FormCheckbox
                          label="Remove image on save"
                          checked={section.removeImage}
                          onChange={(e) => updateSection(index, "removeImage", e.target.checked)}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <Button type="button" size="sm" variant="ghost" onClick={addSection}>
              <Plus className="h-4 w-4" />
              Add section
            </Button>
            <FormHint>{JOURNAL_FIELD_HINTS.sections}</FormHint>
          </FormSection>

          <FormSection title="Highlighted finding (optional)">
            <FormField label="Callout label">
              <FormInput
                value={form.calloutLabel}
                onChange={(e) => setForm({ ...form, calloutLabel: e.target.value })}
                placeholder="Highlighted Finding"
              />
            </FormField>
            <FormField label="Callout body">
              <FormTextarea
                value={form.calloutBody}
                onChange={(e) => setForm({ ...form, calloutBody: e.target.value })}
                rows={3}
              />
            </FormField>
          </FormSection>

          <FormSection title="Attachments">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Cover image">
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setForm({ ...form, cover: e.target.files?.[0] || null })}
                />
              </FormField>

              <FormField label="Full paper PDF">
                <input
                  type="file"
                  accept="application/pdf"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setForm({ ...form, pdf: e.target.files?.[0] || null })}
                />
              </FormField>
            </div>

            {editId && existing ? (
              <div className="space-y-3 rounded-lg border border-[var(--border-subtle)] p-3">
                {existing.coverImage ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <img src={existing.coverImage} alt="" className="h-16 w-24 rounded object-cover" />
                    <button type="button" className="btn btn-xs btn-ghost text-rose-600" onClick={handleRemoveCover}>
                      Remove cover
                    </button>
                    <FormCheckbox
                      label="Remove cover on save"
                      checked={form.removeCover}
                      onChange={(e) => setForm({ ...form, removeCover: e.target.checked })}
                    />
                  </div>
                ) : null}
                {existing.pdfUrl ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <a href={existing.pdfUrl} target="_blank" rel="noreferrer" className="link link-primary text-sm">
                      View PDF
                    </a>
                    <button type="button" className="btn btn-xs btn-ghost text-rose-600" onClick={handleRemovePdf}>
                      Remove PDF
                    </button>
                    <FormCheckbox
                      label="Remove PDF on save"
                      checked={form.removePdf}
                      onChange={(e) => setForm({ ...form, removePdf: e.target.checked })}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
          </FormSection>

          <FormSection title="Visibility">
            <div className="space-y-3">
              <FormCheckbox
                label="Featured (Editor's Pick on journal page)"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              <FormHint>{JOURNAL_FIELD_HINTS.featured}</FormHint>

              <FormCheckbox
                label="Popular / Most Cited (sidebar list)"
                checked={form.isPopular}
                onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
              />
              <FormHint>{JOURNAL_FIELD_HINTS.isPopular}</FormHint>

              <FormCheckbox
                label="Published — visible on public website"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
            </div>
          </FormSection>

          <FormActions
            onCancel={() => setOpen(false)}
            loading={saving}
            submitLabel={editId ? "Update" : "Create"}
          />
        </form>
      </Modal>
    </div>
  );
}
