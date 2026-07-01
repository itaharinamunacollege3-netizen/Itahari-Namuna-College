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
  listUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
  removeUnitIcon,
  listUnitCategories,
  createUnitCategory,
  updateUnitCategory,
  deleteUnitCategory,
} from "@/services/units.service";
import { optionalString } from "@/utils/formHelpers";

const emptyForm = {
  code: "",
  categoryId: "",
  title: "",
  objectives: [""],
  duties: [""],
  actionPlan: [{ sn: 0, activity: "", byWhen: "", byWho: "", budget: "" }],
  slug: "",
  sortOrder: 0,
  featured: false,
  published: true,
  removeIcon: false,
  icon: null,
};

const emptyCategoryForm = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
  isActive: true,
};

function toForm(unit) {
  return {
    code: unit.code || "",
    categoryId: unit.categoryId || "",
    title: unit.title || "",
    objectives: unit.objectives?.length > 0 ? unit.objectives : [""],
    duties: unit.duties?.length > 0 ? unit.duties : [""],
    actionPlan: unit.actionPlan?.length > 0
      ? unit.actionPlan
      : [{ sn: 0, activity: "", byWhen: "", byWho: "", budget: "" }],
    slug: unit.slug || "",
    sortOrder: unit.sortOrder || 0,
    featured: Boolean(unit.featured),
    published: unit.published !== false,
    removeIcon: false,
    icon: null,
  };
}

function toPayload(form) {
  const objectives = form.objectives.map((d) => d.trim()).filter((d) => d.length > 0);
  const duties = form.duties.map((s) => s.trim()).filter((s) => s.length > 0);
  const actionPlan = form.actionPlan.filter((ap) => ap.activity.trim().length > 0).map((ap) => ({
    sn: Number(ap.sn) || 0,
    activity: ap.activity.trim(),
    byWhen: ap.byWhen.trim(),
    byWho: ap.byWho.trim(),
    budget: ap.budget.trim(),
  }));
  return {
    code: form.code.trim(),
    categoryId: Number(form.categoryId),
    title: form.title.trim(),
    objectives,
    duties,
    actionPlan,
    slug: optionalString(form.slug),
    sortOrder: Number(form.sortOrder) || 0,
    featured: form.featured,
    published: form.published,
    removeIcon: form.removeIcon,
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

export default function UnitsPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [categorySaving, setCategorySaving] = useState(false);

  const { data: units, loading: unitsLoading, error: unitsError, reload: reloadUnits } =
    useAsyncData(() => listUnits({ limit: 50 }), []);

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    reload: reloadCategories,
  } = useAsyncData(() => listUnitCategories(), []);

  function openCreate() {
    setEditId(null);
    setExisting(null);
    setForm(emptyForm);
    setOpen(true);
  }

  async function openEdit(id) {
    try {
      const { data: unit } = await getUnit(id);
      setEditId(id);
      setExisting(unit);
      setForm(toForm(unit));
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
    if (form.code.trim().length < 1) {
      toast.error("Code is required");
      return;
    }
    if (form.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }

    const payload = toPayload(form);

    if (payload.objectives.length < 1) {
      toast.error("At least one objective is required");
      return;
    }

    if (payload.duties.length < 1) {
      toast.error("At least one duty is required");
      return;
    }

    setSaving(true);
    const files = { icon: form.icon };

    try {
      if (editId) {
        await updateUnit(editId, payload, files);
        toast.success("Unit updated");
      } else {
        await createUnit(payload, files);
        toast.success("Unit created");
      }
      setOpen(false);
      setForm(emptyForm);
      setEditId(null);
      setExisting(null);
      reloadUnits();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this unit?")) return;
    try {
      await deleteUnit(id);
      toast.success("Unit deleted");
      reloadUnits();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleRemoveIcon() {
    if (!editId || !confirm("Remove unit icon?")) return;
    try {
      await removeUnitIcon(editId);
      toast.success("Icon removed");
      const { data: unit } = await getUnit(editId);
      setExisting(unit);
      setForm((prev) => ({ ...prev, removeIcon: false }));
      reloadUnits();
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
        await updateUnitCategory(editCategoryId, payload);
        toast.success("Category updated");
      } else {
        await createUnitCategory(payload);
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
      await deleteUnitCategory(id);
      toast.success("Category deleted");
      reloadCategories();
    } catch (err) {
      toast.error(err.message);
    }
  }

  function addObjective() {
    setForm((prev) => ({
      ...prev,
      objectives: [...prev.objectives, ""],
    }));
  }

  function removeObjective(index) {
    if (form.objectives.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  }

  function updateObjective(index, value) {
    setForm((prev) => {
      const newObjectives = [...prev.objectives];
      newObjectives[index] = value;
      return { ...prev, objectives: newObjectives };
    });
  }

  function addDuty() {
    setForm((prev) => ({
      ...prev,
      duties: [...prev.duties, ""],
    }));
  }

  function removeDuty(index) {
    if (form.duties.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      duties: prev.duties.filter((_, i) => i !== index),
    }));
  }

  function updateDuty(index, value) {
    setForm((prev) => {
      const newDuties = [...prev.duties];
      newDuties[index] = value;
      return { ...prev, duties: newDuties };
    });
  }

  function addActionPlanItem() {
    setForm((prev) => ({
      ...prev,
      actionPlan: [
        ...prev.actionPlan,
        { sn: prev.actionPlan.length, activity: "", byWhen: "", byWho: "", budget: "" },
      ],
    }));
  }

  function removeActionPlanItem(index) {
    if (form.actionPlan.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      actionPlan: prev.actionPlan.filter((_, i) => i !== index),
    }));
  }

  function updateActionPlanItem(index, field, value) {
    setForm((prev) => {
      const newActionPlan = [...prev.actionPlan];
      newActionPlan[index] = { ...newActionPlan[index], [field]: value };
      return { ...prev, actionPlan: newActionPlan };
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Units"
        subtitle="Manage college units shown on the public website"
        actions={
          <Button type="button" size="sm" variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Unit
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Units</h3>
          </div>
          {unitsError ? (
            <div className="alert alert-error">{unitsError}</div>
          ) : unitsLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable>
              <DataTableHead>
                <DataTableRow className="text-xs uppercase text-[var(--text-muted)]">
                  <DataTableHeaderCell>Title</DataTableHeaderCell>
                  <DataTableHeaderCell>Category</DataTableHeaderCell>
                  <DataTableHeaderCell>Code</DataTableHeaderCell>
                  <DataTableHeaderCell>Status</DataTableHeaderCell>
                  <DataTableHeaderCell />
                </DataTableRow>
              </DataTableHead>
              <DataTableBody>
                {units?.length ? (
                  units.map((row) => (
                    <DataTableRow key={row.id}>
                      <DataTableCell>
                        <p className="font-medium">{row.title}</p>
                        <p className="text-xs text-[var(--text-muted)] line-clamp-1">{row.code}</p>
                      </DataTableCell>
                      <DataTableCell>{row.category || "—"}</DataTableCell>
                      <DataTableCell>{row.code || "—"}</DataTableCell>
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
                  <DataTableEmpty colSpan={5}>No units found</DataTableEmpty>
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
                        {category._count?.units || 0} units
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

      {/* Unit Modal */}
      <Modal
        open={open}
        title={editId ? "Edit Unit" : "Create Unit"}
        onClose={() => setOpen(false)}
        wide="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Basic Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Code *">
                <FormInput
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="U01"
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
          </FormSection>

          <FormSection title="Objectives">
            {form.objectives.map((objective, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Objective {index + 1} *
                  </label>
                  <div className="flex gap-2">
                    {index === form.objectives.length - 1 && (
                      <Button type="button" size="xs" variant="primary" onClick={addObjective}>
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </Button>
                    )}
                    {form.objectives.length > 1 && (
                      <Button
                        type="button"
                        size="xs"
                        variant="danger"
                        onClick={() => removeObjective(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                <FormTextarea
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  rows={3}
                  required
                />
              </div>
            ))}
          </FormSection>

          <FormSection title="Duties">
            {form.duties.map((duty, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Duty {index + 1} *
                  </label>
                  <div className="flex gap-2">
                    {index === form.duties.length - 1 && (
                      <Button type="button" size="xs" variant="primary" onClick={addDuty}>
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </Button>
                    )}
                    {form.duties.length > 1 && (
                      <Button
                        type="button"
                        size="xs"
                        variant="danger"
                        onClick={() => removeDuty(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                <FormTextarea
                  value={duty}
                  onChange={(e) => updateDuty(index, e.target.value)}
                  rows={2}
                  required
                />
              </div>
            ))}
          </FormSection>

          <FormSection title="Action Plan">
            {form.actionPlan.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Action Item {index + 1}
                  </label>
                  <div className="flex gap-2">
                    {index === form.actionPlan.length - 1 && (
                      <Button type="button" size="xs" variant="primary" onClick={addActionPlanItem}>
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </Button>
                    )}
                    {form.actionPlan.length > 1 && (
                      <Button
                        type="button"
                        size="xs"
                        variant="danger"
                        onClick={() => removeActionPlanItem(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="SN">
                    <FormInput
                      type="number"
                      value={item.sn}
                      onChange={(e) => updateActionPlanItem(index, "sn", e.target.value)}
                      min={0}
                    />
                  </FormField>
                  <FormField label="Activity">
                    <FormInput
                      value={item.activity}
                      onChange={(e) => updateActionPlanItem(index, "activity", e.target.value)}
                    />
                  </FormField>
                  <FormField label="By When">
                    <FormInput
                      value={item.byWhen}
                      onChange={(e) => updateActionPlanItem(index, "byWhen", e.target.value)}
                    />
                  </FormField>
                  <FormField label="By Who">
                    <FormInput
                      value={item.byWho}
                      onChange={(e) => updateActionPlanItem(index, "byWho", e.target.value)}
                    />
                  </FormField>
                  <FormField label="Budget">
                    <FormInput
                      value={item.budget}
                      onChange={(e) => updateActionPlanItem(index, "budget", e.target.value)}
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </FormSection>

          <FormSection title="Media">
            <FormField label="Unit Icon">
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setForm({ ...form, icon: e.target.files?.[0] || null })}
              />
            </FormField>

            {editId && existing?.iconUrl ? (
              <div className="space-y-3 rounded-lg border border-[var(--border-subtle)] p-3">
                <p className="text-sm font-medium">Current Icon</p>
                <div className="flex flex-wrap items-center gap-3">
                  <img
                    src={existing.iconUrl}
                    alt=""
                    className="h-40 w-full rounded object-cover"
                  />
                  <button
                    type="button"
                    className="btn btn-xs btn-ghost text-rose-600"
                    onClick={handleRemoveIcon}
                  >
                    Remove Icon
                  </button>
                  <FormCheckbox
                    label="Remove icon on save"
                    checked={form.removeIcon}
                    onChange={(e) => setForm({ ...form, removeIcon: e.target.checked })}
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
                  placeholder="academic-affairs"
                />
              </FormField>
            </div>

            <div className="space-y-3">
              <FormCheckbox
                label="Featured unit (shown prominently)"
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
                placeholder="academic-units"
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
