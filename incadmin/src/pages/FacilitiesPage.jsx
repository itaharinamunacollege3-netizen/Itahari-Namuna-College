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
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  listFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  removeFacilityImage,
  listFacilityCategories,
  createFacilityCategory,
  updateFacilityCategory,
  deleteFacilityCategory,
} from "@/services/facilities.service";
import { optionalString } from "@/utils/formHelpers";

const emptyForm = {
  index: "",
  categoryId: "",
  title: "",
  tagline: "",
  descriptions: [""],
  specs: [""],
  slug: "",
  sortOrder: 0,
  featured: false,
  published: true,
  removeImage: false,
  image: null,
};

const emptyCategoryForm = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
  isActive: true,
};

function toForm(facility) {
  return {
    index: facility.index || "",
    categoryId: facility.categoryId || "",
    title: facility.title || "",
    tagline: facility.tagline || "",
    descriptions: facility.descriptions?.length > 0 ? facility.descriptions : [""],
    specs: facility.specs?.length > 0 ? facility.specs : [""],
    slug: facility.slug || "",
    sortOrder: facility.sortOrder || 0,
    featured: Boolean(facility.featured),
    published: facility.published !== false,
    removeImage: false,
    image: null,
  };
}

function toPayload(form) {
  const descriptions = form.descriptions.map((d) => d.trim()).filter((d) => d.length > 0);
  const specs = form.specs.map((s) => s.trim()).filter((s) => s.length > 0);
  return {
    index: form.index.trim(),
    categoryId: Number(form.categoryId),
    title: form.title.trim(),
    tagline: form.tagline.trim(),
    descriptions,
    specs,
    slug: optionalString(form.slug),
    sortOrder: Number(form.sortOrder) || 0,
    featured: form.featured,
    published: form.published,
    removeImage: form.removeImage,
  };
}

function categoryToPayload(form) {
  return {
    name: form.name.trim(),
    slug: optionalString(form.slug),
    description: optionalString(form.description),
    sortOrder: Number(form.sortOrder) || 0,
    isActive: form.isActive,
  };
}

export default function FacilitiesPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [categorySaving, setCategorySaving] = useState(false);

  const { data: facilities, loading: facilitiesLoading, error: facilitiesError, reload: reloadFacilities } =
    useAsyncData(() => listFacilities({ limit: 50 }), []);

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    reload: reloadCategories,
  } = useAsyncData(() => listFacilityCategories(), []);

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

    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }
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

    const payload = toPayload(form);

    if (payload.descriptions.length < 1) {
      toast.error("At least one description is required");
      return;
    }

    if (payload.specs.length < 1) {
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
      reloadFacilities();
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
      reloadFacilities();
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
      reloadFacilities();
    } catch (err) {
      toast.error(err.message);
    }
  }

  function openCreateCategory() {
    setEditCategoryId(null);
    setCategoryForm(emptyCategoryForm);
    setCategoryModalOpen(true);
  }

  function openEditCategory(category) {
    setEditCategoryId(category.id);
    setCategoryForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      sortOrder: category.sortOrder || 0,
      isActive: category.isActive !== false,
    });
    setCategoryModalOpen(true);
  }

  async function handleCategorySubmit(e) {
    e.preventDefault();

    if (categoryForm.name.trim().length < 2) {
      toast.error("Category name must be at least 2 characters");
      return;
    }

    setCategorySaving(true);
    const payload = categoryToPayload(categoryForm);

    try {
      if (editCategoryId) {
        await updateFacilityCategory(editCategoryId, payload);
        toast.success("Category updated");
      } else {
        await createFacilityCategory(payload);
        toast.success("Category created");
      }
      setCategoryModalOpen(false);
      setCategoryForm(emptyCategoryForm);
      setEditCategoryId(null);
      reloadCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCategorySaving(false);
    }
  }

  async function handleDeleteCategory(id) {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteFacilityCategory(id);
      toast.success("Category deleted");
      reloadCategories();
    } catch (err) {
      toast.error(err.message);
    }
  }

  function addDescription() {
    setForm((prev) => ({
      ...prev,
      descriptions: [...prev.descriptions, ""],
    }));
  }

  function removeDescription(index) {
    if (form.descriptions.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      descriptions: prev.descriptions.filter((_, i) => i !== index),
    }));
  }

  function updateDescription(index, value) {
    setForm((prev) => {
      const newDescriptions = [...prev.descriptions];
      newDescriptions[index] = value;
      return { ...prev, descriptions: newDescriptions };
    });
  }

  function addSpec() {
    setForm((prev) => ({
      ...prev,
      specs: [...prev.specs, ""],
    }));
  }

  function removeSpec(index) {
    if (form.specs.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  }

  function updateSpec(index, value) {
    setForm((prev) => {
      const newSpecs = [...prev.specs];
      newSpecs[index] = value;
      return { ...prev, specs: newSpecs };
    });
  }

  return (
    <div className="space-y-6">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Facilities</h3>
          </div>
          {facilitiesError ? (
            <div className="alert alert-error">{facilitiesError}</div>
          ) : facilitiesLoading ? (
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
                {facilities?.length ? (
                  facilities.map((row) => (
                    <DataTableRow key={row.id}>
                      <DataTableCell>
                        <p className="font-medium">{row.title}</p>
                        <p className="text-xs text-[var(--text-muted)] line-clamp-1">{row.tagline}</p>
                      </DataTableCell>
                      <DataTableCell>{row.category || "—"}</DataTableCell>
                      <DataTableCell>{row.index || "—"}</DataTableCell>
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
                          <Button
                            type="button"
                            size="xs"
                            variant="ghost"
                            onClick={() => openEdit(row.id)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            size="xs"
                            variant="danger"
                            onClick={() => handleDelete(row.id)}
                          >
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

        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Categories</h3>
            <Button type="button" size="sm" variant="primary" onClick={openCreateCategory}>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
          {categoriesError ? (
            <div className="alert alert-error">{categoriesError}</div>
          ) : categoriesLoading ? (
            <TableSkeleton rows={4} />
          ) : (
            <ul className="space-y-2">
              {categories?.length ? (
                categories.map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {category._count?.facilities || 0} facilities
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!category.isActive ? (
                        <span className="badge badge-ghost badge-sm">Inactive</span>
                      ) : null}
                      <Button
                        type="button"
                        size="xs"
                        variant="ghost"
                        onClick={() => openEditCategory(category)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="xs"
                        variant="danger"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="py-6 text-center text-[var(--text-muted)]">No categories</p>
              )}
            </ul>
          )}
        </Card>
      </div>

      {/* Facility Modal */}
      <Modal
        open={open}
        title={editId ? "Edit Facility" : "Create Facility"}
        onClose={() => setOpen(false)}
        wide="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Basic Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Index *">
                <FormInput
                  value={form.index}
                  onChange={(e) => setForm({ ...form, index: e.target.value })}
                  placeholder="01"
                  required
                />
              </FormField>

              <FormField label="Category *">
                <div className="flex gap-2">
                  <FormSelect
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    required
                    className="flex-1"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </FormSelect>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={openCreateCategory}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </FormField>
            </div>

            <FormField label="Title *">
              <FormInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                minLength={3}
                required
              />
            </FormField>

            <FormField label="Tagline *">
              <FormInput
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                minLength={3}
                required
              />
            </FormField>
          </FormSection>

          <FormSection title="Descriptions">
            {form.descriptions.map((desc, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Description {index + 1} *
                  </label>
                  <div className="flex gap-2">
                    {index === form.descriptions.length - 1 && (
                      <Button type="button" size="xs" variant="primary" onClick={addDescription}>
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </Button>
                    )}
                    {form.descriptions.length > 1 && (
                      <Button
                        type="button"
                        size="xs"
                        variant="danger"
                        onClick={() => removeDescription(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                <FormTextarea
                  value={desc}
                  onChange={(e) => updateDescription(index, e.target.value)}
                  rows={3}
                  required
                />
              </div>
            ))}
          </FormSection>

          <FormSection title="Specifications">
            {form.specs.map((spec, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Specification {index + 1} *
                  </label>
                  <div className="flex gap-2">
                    {index === form.specs.length - 1 && (
                      <Button type="button" size="xs" variant="primary" onClick={addSpec}>
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </Button>
                    )}
                    {form.specs.length > 1 && (
                      <Button
                        type="button"
                        size="xs"
                        variant="danger"
                        onClick={() => removeSpec(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                <FormTextarea
                  value={spec}
                  onChange={(e) => updateSpec(index, e.target.value)}
                  rows={2}
                  required
                />
              </div>
            ))}
          </FormSection>

          <FormSection title="Media">
            <FormField label="Facility Image">
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
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
              </FormField>

              <FormField label="Slug">
                <FormInput
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="advanced-computing-lab"
                />
              </FormField>
            </div>

            <div className="space-y-3">
              <FormCheckbox
                label="Featured facility (shown prominently)"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />

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

      {/* Category Modal */}
      <Modal
        open={categoryModalOpen}
        title={editCategoryId ? "Edit Category" : "Add Category"}
        onClose={() => setCategoryModalOpen(false)}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <FormSection title="Category Details">
            <FormField label="Name *">
              <FormInput
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                minLength={2}
                required
              />
            </FormField>

            <FormField label="Slug">
              <FormInput
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                placeholder="computing-labs"
              />
              <FormHint>Auto-generated from name if left empty</FormHint>
            </FormField>

            <FormField label="Description">
              <FormTextarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              />
            </FormField>

            <FormField label="Sort Order">
              <FormInput
                type="number"
                min={0}
                value={categoryForm.sortOrder}
                onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: e.target.value })}
              />
            </FormField>

            <FormCheckbox
              label="Active"
              checked={categoryForm.isActive}
              onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
            />
          </FormSection>

          <FormActions
            onCancel={() => setCategoryModalOpen(false)}
            loading={categorySaving}
            submitLabel={editCategoryId ? "Update" : "Create"}
          />
        </form>
      </Modal>
    </div>
  );
}
