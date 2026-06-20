import { useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TableSkeleton } from "@/components/ui/Skeleton";
import {
  Modal,
  FormField,
  FormInput,
  FormTextarea,
  FormCheckbox,
  FormHint,
  FormSection,
  FormActions,
} from "@/components/ui/Modal";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  createProgram,
  deleteProgram,
  getProgram,
  listPrograms,
  removeProgramCover,
  updateProgram,
  uploadProgramCover,
} from "@/services/programs.service";
import { nullableNumber, optionalString, splitCsv } from "@/utils/formHelpers";

const emptyForm = {
  title: "",
  code: "",
  slug: "",
  tagline: "",
  duration: "",
  university: "",
  overview: "",
  objectives: "",
  careerPathways: "",
  eligibility: "",
  highlights: "",
  curriculum: '{"Semester 1":["Subject 1","Subject 2"]}',
  seats: "",
  isFeatured: true,
  sortOrder: 0,
  published: true,
  cover: null,
};

function toForm(program) {
  return {
    title: program.title ?? "",
    code: program.code ?? "",
    slug: program.slug ?? program.id ?? "",
    tagline: program.tagline ?? "",
    duration: program.duration ?? "",
    university: program.university ?? "",
    overview: program.overview ?? "",
    objectives: Array.isArray(program.objectives) ? program.objectives.join(", ") : "",
    careerPathways: Array.isArray(program.careerPathways) ? program.careerPathways.join(", ") : "",
    eligibility: Array.isArray(program.eligibility) ? program.eligibility.join(", ") : "",
    highlights: Array.isArray(program.highlights) ? program.highlights.join(", ") : "",
    curriculum: JSON.stringify(program.curriculum ?? {}, null, 2),
    seats: program.seats ?? "",
    isFeatured: program.isFeatured !== false,
    sortOrder: program.sortOrder ?? 0,
    published: program.published !== false,
    cover: null,
  };
}

function toPayload(form) {
  let curriculum;
  try {
    curriculum = JSON.parse(form.curriculum);
  } catch {
    throw new Error("Curriculum must be valid JSON");
  }

  return {
    title: form.title.trim(),
    code: optionalString(form.code),
    slug: optionalString(form.slug),
    tagline: optionalString(form.tagline),
    duration: optionalString(form.duration),
    university: optionalString(form.university),
    overview: form.overview.trim(),
    objectives: splitCsv(form.objectives),
    careerPathways: splitCsv(form.careerPathways),
    eligibility: splitCsv(form.eligibility),
    highlights: splitCsv(form.highlights),
    curriculum,
    seats: nullableNumber(form.seats),
    isFeatured: form.isFeatured,
    sortOrder: Number(form.sortOrder) || 0,
    published: form.published,
  };
}

export default function ProgramsPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [existingImage, setExistingImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsyncData(() => listPrograms(), []);

  function openCreate() {
    setEditId(null);
    setExistingImage(null);
    setForm(emptyForm);
    setOpen(true);
  }

  async function openEdit(id) {
    try {
      const { data: program } = await getProgram(id);
      setEditId(id);
      setExistingImage(program.image ?? null);
      setForm(toForm(program));
      setOpen(true);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = toPayload(form);
      let id = editId;
      if (editId) {
        await updateProgram(editId, payload);
        toast.success("Program updated");
      } else {
        const { data: created } = await createProgram(payload);
        id = created.dbId ?? created.id;
        toast.success("Program created");
      }
      if (form.cover && id) {
        await uploadProgramCover(id, form.cover);
      }
      setOpen(false);
      setForm(emptyForm);
      setEditId(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this program?")) return;
    try {
      await deleteProgram(id);
      toast.success("Program deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleRemoveCover() {
    if (!editId || !confirm("Remove cover image?")) return;
    try {
      await removeProgramCover(editId);
      setExistingImage(null);
      toast.success("Cover removed");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Programs"
        subtitle="Academic programs offered"
        actions={
          <button type="button" className="btn btn-sm bg-[var(--color-brand-primary)] text-white" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Program
          </button>
        }
      />

      <div className="card-surface p-4">
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : loading ? (
          <TableSkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data?.length ? (
              data.map((program) => (
                <div key={program.dbId} className="rounded-xl border border-[var(--border-subtle)] p-4">
                  {program.image ? (
                    <img src={program.image} alt={program.title} className="mb-3 h-32 w-full rounded-lg object-cover" />
                  ) : null}
                  <p className="text-xs font-semibold uppercase text-[var(--color-brand-primary)]">{program.code}</p>
                  <h3 className="mt-1 font-bold">{program.title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)] line-clamp-2">{program.tagline || program.overview}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="badge badge-ghost badge-sm">{program.published ? "Published" : "Draft"}</span>
                    <div className="flex gap-1">
                      <button type="button" className="btn btn-ghost btn-xs" onClick={() => openEdit(program.dbId)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" className="btn btn-ghost btn-xs text-rose-600" onClick={() => handleDelete(program.dbId)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full py-10 text-center text-[var(--text-muted)]">No programs found</p>
            )}
          </div>
        )}
      </div>

      <Modal open={open} title={editId ? "Edit Program" : "Create Program"} onClose={() => setOpen(false)} wide="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection title="Program details">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Title *">
                <FormInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} minLength={3} required />
              </FormField>
              <FormField label="Code">
                <FormInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="BCA" />
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Slug">
                <FormInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="bachelor-computer-applications" />
                <FormHint>Lowercase letters, numbers, and hyphens only</FormHint>
              </FormField>
              <FormField label="Tagline">
                <FormInput value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Duration">
                <FormInput value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="4 Years" />
              </FormField>
              <FormField label="University">
                <FormInput value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
              </FormField>
              <FormField label="Seats">
                <FormInput type="number" min="0" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} placeholder="40" />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Academic content">
            <FormField label="Overview *">
              <FormTextarea value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} minLength={20} required />
              <FormHint>Minimum 20 characters</FormHint>
            </FormField>
            <FormField label="Objectives *">
              <FormInput value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} required placeholder="Objective 1, Objective 2" />
              <FormHint>Comma-separated list</FormHint>
            </FormField>
            <FormField label="Career pathways *">
              <FormInput value={form.careerPathways} onChange={(e) => setForm({ ...form, careerPathways: e.target.value })} required />
            </FormField>
            <FormField label="Eligibility *">
              <FormInput value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} required />
            </FormField>
            <FormField label="Highlights *">
              <FormInput value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} required />
            </FormField>
            <FormField label="Curriculum (JSON) *">
              <FormTextarea value={form.curriculum} onChange={(e) => setForm({ ...form, curriculum: e.target.value })} rows={6} required />
              <FormHint>Example: {`{"Semester 1":["Math","English"]}`}</FormHint>
            </FormField>
          </FormSection>

          <FormSection title="Media & visibility">
            <FormField label="Cover image">
              <input type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={(e) => setForm({ ...form, cover: e.target.files?.[0] ?? null })} />
            </FormField>
            {existingImage ? (
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
                <img src={existingImage} alt="" className="h-16 w-24 rounded object-cover" />
                <button type="button" className="btn btn-xs btn-ghost text-rose-600" onClick={handleRemoveCover}>
                  <ImagePlus className="h-3 w-3" />
                  Remove cover
                </button>
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Sort order">
                <FormInput type="number" min="0" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
              </FormField>
              <div className="flex flex-col justify-end gap-3 pb-1">
                <FormCheckbox label="Featured on homepage" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                <FormCheckbox label="Published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              </div>
            </div>
          </FormSection>

          <FormActions onCancel={() => setOpen(false)} loading={saving} submitLabel={editId ? "Update" : "Create"} />
        </form>
      </Modal>
    </div>
  );
}
