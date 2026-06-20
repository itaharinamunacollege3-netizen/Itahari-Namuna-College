import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
  createFacultyDepartment,
  createStaffCategory,
  deleteFacultyDepartment,
  deleteStaffCategory,
  listFacultyDepartments,
  listStaffCategories,
  updateFacultyDepartment,
  updateStaffCategory,
} from "@/services/categories.service";
import { optionalString } from "@/utils/formHelpers";

const emptyCat = { name: "", slug: "", description: "", sortOrder: 0, isActive: true };
const emptyDept = { name: "", slug: "", description: "", sortOrder: 0, isActive: true };

function toPayload(form) {
  return {
    name: form.name.trim(),
    slug: optionalString(form.slug),
    description: optionalString(form.description),
    sortOrder: Number(form.sortOrder) || 0,
    isActive: form.isActive,
  };
}

export default function CategoriesPage() {
  const [catOpen, setCatOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [editCatId, setEditCatId] = useState(null);
  const [editDeptId, setEditDeptId] = useState(null);
  const [catForm, setCatForm] = useState(emptyCat);
  const [deptForm, setDeptForm] = useState(emptyDept);
  const [saving, setSaving] = useState(false);

  const staff = useAsyncData(() => listStaffCategories(), []);
  const faculty = useAsyncData(() => listFacultyDepartments(), []);

  function openCreateCategory() {
    setEditCatId(null);
    setCatForm(emptyCat);
    setCatOpen(true);
  }

  function openEditCategory(cat) {
    setEditCatId(cat.id);
    setCatForm({
      name: cat.name ?? "",
      slug: cat.slug ?? "",
      description: cat.description ?? "",
      sortOrder: cat.sortOrder ?? 0,
      isActive: cat.isActive !== false,
    });
    setCatOpen(true);
  }

  function openCreateDepartment() {
    setEditDeptId(null);
    setDeptForm(emptyDept);
    setDeptOpen(true);
  }

  function openEditDepartment(dept) {
    setEditDeptId(dept.id);
    setDeptForm({
      name: dept.name ?? "",
      slug: dept.slug ?? "",
      description: dept.description ?? "",
      sortOrder: dept.sortOrder ?? 0,
      isActive: dept.isActive !== false,
    });
    setDeptOpen(true);
  }

  async function handleCategorySubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = toPayload(catForm);
    try {
      if (editCatId) {
        await updateStaffCategory(editCatId, payload);
        toast.success("Category updated");
      } else {
        await createStaffCategory(payload);
        toast.success("Category created");
      }
      setCatOpen(false);
      setCatForm(emptyCat);
      setEditCatId(null);
      staff.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDepartmentSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = toPayload(deptForm);
    try {
      if (editDeptId) {
        await updateFacultyDepartment(editDeptId, payload);
        toast.success("Department updated");
      } else {
        await createFacultyDepartment(payload);
        toast.success("Department created");
      }
      setDeptOpen(false);
      setDeptForm(emptyDept);
      setEditDeptId(null);
      faculty.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(id) {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteStaffCategory(id);
      toast.success("Category deleted");
      staff.reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteDepartment(id) {
    if (!confirm("Delete this department?")) return;
    try {
      await deleteFacultyDepartment(id);
      toast.success("Department deleted");
      faculty.reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const categoryFormFields = (form, setForm) => (
    <>
      <FormField label="Name *">
        <FormInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} minLength={2} required />
      </FormField>
      <FormField label="Slug">
        <FormInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="administration" />
        <FormHint>Auto-generated from name if left empty</FormHint>
      </FormField>
      <FormField label="Description">
        <FormTextarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </FormField>
      <FormField label="Sort order">
        <FormInput type="number" min="0" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
      </FormField>
      <FormCheckbox label="Active" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
    </>
  );

  return (
    <div>
      <PageHeader title="Categories" subtitle="Staff categories and faculty departments" />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-surface p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Staff Categories</h2>
            <button type="button" className="btn btn-sm" onClick={openCreateCategory}>
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          {staff.error ? (
            <div className="alert alert-error">{staff.error}</div>
          ) : staff.loading ? (
            <TableSkeleton rows={4} />
          ) : (
            <ul className="space-y-2">
              {staff.data?.length ? (
                staff.data.map((cat) => (
                  <li key={cat.id} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] px-4 py-3">
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{cat.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-ghost">{cat._count?.staff ?? 0} staff</span>
                      {!cat.isActive ? <span className="badge badge-ghost badge-sm">Inactive</span> : null}
                      <button type="button" className="btn btn-ghost btn-xs" onClick={() => openEditCategory(cat)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" className="btn btn-ghost btn-xs text-rose-600" onClick={() => handleDeleteCategory(cat.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="py-6 text-center text-[var(--text-muted)]">No categories</p>
              )}
            </ul>
          )}
        </section>

        <section className="card-surface p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Faculty Departments</h2>
            <button type="button" className="btn btn-sm" onClick={openCreateDepartment}>
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          {faculty.error ? (
            <div className="alert alert-error">{faculty.error}</div>
          ) : faculty.loading ? (
            <TableSkeleton rows={4} />
          ) : (
            <ul className="space-y-2">
              {faculty.data?.length ? (
                faculty.data.map((dept) => (
                  <li key={dept.id} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] px-4 py-3">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{dept.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-ghost">{dept._count?.faculty ?? 0} faculty</span>
                      {!dept.isActive ? <span className="badge badge-ghost badge-sm">Inactive</span> : null}
                      <button type="button" className="btn btn-ghost btn-xs" onClick={() => openEditDepartment(dept)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" className="btn btn-ghost btn-xs text-rose-600" onClick={() => handleDeleteDepartment(dept.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="py-6 text-center text-[var(--text-muted)]">No departments</p>
              )}
            </ul>
          )}
        </section>
      </div>

      <Modal open={catOpen} title={editCatId ? "Edit Staff Category" : "Add Staff Category"} onClose={() => setCatOpen(false)}>
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <FormSection title="Category details">
            {categoryFormFields(catForm, setCatForm)}
          </FormSection>
          <FormActions onCancel={() => setCatOpen(false)} loading={saving} submitLabel={editCatId ? "Update" : "Create"} />
        </form>
      </Modal>

      <Modal open={deptOpen} title={editDeptId ? "Edit Faculty Department" : "Add Faculty Department"} onClose={() => setDeptOpen(false)}>
        <form onSubmit={handleDepartmentSubmit} className="space-y-4">
          <FormSection title="Department details">
            {categoryFormFields(deptForm, setDeptForm)}
          </FormSection>
          <FormActions onCancel={() => setDeptOpen(false)} loading={saving} submitLabel={editDeptId ? "Update" : "Create"} />
        </form>
      </Modal>
    </div>
  );
}
