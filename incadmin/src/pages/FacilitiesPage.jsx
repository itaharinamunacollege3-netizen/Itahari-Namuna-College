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
  FACILITY_CATEGORIES,
  FACILITY_FIELD_HINTS,
} from "@/constants/facilities";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  createFacility,
  deleteFacility,
  getFacility,
  listFacilities,
  removeFacilityImage,
  updateFacility,
} from "@/services/facilities.service";
import { optionalString } from "@/utils/formHelpers";

const emptyForm = {
  index: "",
  category: "Computing Labs",
  title: "",
  tagline: "",
  descriptionPart1: "",
  descriptionPart2: "",
  specs: "",
  slug: "",
  sortOrder: 0,
  featured: false,
  published: true,
  removeImage: false,
  image: null,
};

function toForm(facility) {
  return {
    index: facility.index ?? "",
    category: facility.category ?? "Computing Labs",
    title: facility.title ?? "",
    tagline: facility.tagline ?? "",
    descriptionPart1: facility.descriptionPart1 ?? "",
    descriptionPart2: facility.descriptionPart2 ?? "",
    specs: Array.isArray(facility.specs) ? facility.specs.join(", ") : "",
    slug: facility.slug ?? "",
    sortOrder: facility.sortOrder ?? 0,
    featured: Boolean(facility.featured),
    published: facility.published !== false,
    removeImage: false,
    image: null,
  };
}

function toPayload(form) {
  const specs = form.specs
    .split(",")
    .map((spec) => spec.trim())
    .filter(Boolean);

  return {
    index: form.index.trim(),
    category: form.category.trim(),
    title: form.title.trim(),
    tagline: form.tagline.trim(),
    descriptionPart1: form.descriptionPart1.trim(),
    descriptionPart2: form.descriptionPart2.trim(),
    specs,
    slug: optionalString(form.slug),
    sortOrder: Number(form.sortOrder) ?? 0,
    featured: form.featured,
    published: form.published,
    removeImage: form.removeImage,
  };
}

export default function FacilitiesPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsyncData(
    () => listFacilities({ limit: 50 }),
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
      const { data: facility } = await getFacility(id);
      setEditId(id);
      setExisting(facility);
      setForm(toForm(facility));
      setOpen(true);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.index.trim().length < 1) {
      toast.error("Index is required");
      return;
    }
    if (form.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (form.tagline.trim().length < 3) {
      toast.error("Tagline must be at least 3 characters");
      return;
    }
    if (form.descriptionPart1.trim().length < 10) {
      toast.error("Description Part 1 must be at least 10 characters");
      return;
    }
    if (form.descriptionPart2.trim().length < 10) {
      toast.error("Description Part 2 must be at least 10 characters");
      return;
    }

    const payload = toPayload(form);
    const specsArray = form.specs
      .split(",")
      .map((spec) => spec.trim())
      .filter(Boolean);
    if (specsArray.length === 0) {
      toast.error("At least one specification is required");
      return;
    }

    setSaving(true);
    const files = { image: form.image };

    try {
      if (editId) {
        await updateFacility(editId, payload, files);
        toast.success("Facility updated");
      } else {
        await createFacility(payload, files);
        toast.success("Facility created");
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
    if (!confirm("Delete this facility?")) return;
    try {
      await deleteFacility(id);
      toast.success("Facility deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleRemoveImage() {
    if (!editId || !confirm("Remove facility image?")) return;
    try {
      await removeFacilityImage(editId);
      toast.success("Image removed");
      const { data: facility } = await getFacility(editId);
      setExisting(facility);
      setForm((prev) => ({ ...prev, removeImage: false }));
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Facilities"
        subtitle="Manage college facilities shown on the public website"
        actions={
          <Button type="button" size="sm" variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Facility
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
                <DataTableHeaderCell>Index</DataTableHeaderCell>
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
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1">{row.tagline}</p>
                    </DataTableCell>
                    <DataTableCell>{row.category ?? "—"}</DataTableCell>
                    <DataTableCell>{row.index ?? "—"}</DataTableCell>
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
                <DataTableEmpty colSpan={5}>No facilities found</DataTableEmpty>
              )}
            </DataTableBody>
          </DataTable>
        )}
      </Card>

      <Modal
        open={open}
        title={editId ? "Edit Facility" : "Create Facility"}
        onClose={() => setOpen(false)}
        wide="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection title="Basic Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Index *">
                <FormInput
                  value={form.index}
                  onChange={(e) => setForm({ ...form, index: e.target.value })}
                  placeholder="01"
                  required
                />
                <FormHint>{FACILITY_FIELD_HINTS.index}</FormHint>
              </FormField>

              <FormField label="Category *">
                <FormSelect
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                >
                  {FACILITY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
            </div>

            <FormField label="Title *">
              <FormInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                minLength={3}
                required
              />
              <FormHint>{FACILITY_FIELD_HINTS.title}</FormHint>
            </FormField>

            <FormField label="Tagline *">
              <FormInput
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                minLength={3}
                required
              />
              <FormHint>{FACILITY_FIELD_HINTS.tagline}</FormHint>
            </FormField>
          </FormSection>

          <FormSection title="Description">
            <FormField label="Description Part 1 *">
              <FormTextarea
                value={form.descriptionPart1}
                onChange={(e) => setForm({ ...form, descriptionPart1: e.target.value })}
                rows={4}
                required
              />
              <FormHint>{FACILITY_FIELD_HINTS.descriptionPart1}</FormHint>
            </FormField>

            <FormField label="Description Part 2 *">
              <FormTextarea
                value={form.descriptionPart2}
                onChange={(e) => setForm({ ...form, descriptionPart2: e.target.value })}
                rows={4}
                required
              />
              <FormHint>{FACILITY_FIELD_HINTS.descriptionPart2}</FormHint>
            </FormField>
          </FormSection>

          <FormSection title="Specifications">
            <FormField label="Specifications *">
              <FormTextarea
                value={form.specs}
                onChange={(e) => setForm({ ...form, specs: e.target.value })}
                rows={3}
                placeholder="32-Core Workstations, GPU Cluster Nodes, Fiber 1Gbps Uplink"
              />
              <FormHint>{FACILITY_FIELD_HINTS.specs}</FormHint>
            </FormField>
          </FormSection>

          <FormSection title="Media">
            <FormField label="Facility Image">
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setForm({ ...form, image: e.target.files?.[0] ?? null })}
              />
            </FormField>

            {editId && existing?.imageUrl ? (
              <div className="space-y-3 rounded-lg border border-[var(--border-subtle)] p-3">
                <p className="text-sm font-medium">Current Image</p>
                <div className="flex flex-wrap items-center gap-3">
                  <img
                    src={existing.imageUrl}
                    alt=""
                    className="h-40 w-full rounded object-cover"
                  />
                  <button
                    type="button"
                    className="btn btn-xs btn-ghost text-rose-600"
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </button>
                  <FormCheckbox
                    label="Remove image on save"
                    checked={form.removeImage}
                    onChange={(e) => setForm({ ...form, removeImage: e.target.checked })}
                  />
                </div>
              </div>
            ) : null}
          </FormSection>

          <FormSection title="Metadata">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Sort Order">
                <FormInput
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                />
                <FormHint>{FACILITY_FIELD_HINTS.sortOrder}</FormHint>
              </FormField>

              <FormField label="Slug">
                <FormInput
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="advanced-computing-lab"
                />
                <FormHint>{FACILITY_FIELD_HINTS.slug}</FormHint>
              </FormField>
            </div>

            <div className="space-y-3">
              <FormCheckbox
                label="Featured facility (shown prominently)"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              <FormHint>{FACILITY_FIELD_HINTS.featured}</FormHint>

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
