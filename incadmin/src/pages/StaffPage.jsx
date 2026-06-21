import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Search, Trash2, Upload, UserCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import {
  Modal,
  FormField,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormSection,
  FormActions,
} from "@/components/ui/Modal";
import { useAsyncData } from "@/hooks/useAsyncData";
import { listStaffCategories, listFacultyDepartments } from "@/services/categories.service";
import { createStaff, deleteStaff, listStaff, updateStaff } from "@/services/staff.service";
import { optionalString } from "@/utils/formHelpers";

const emptyForm = {
  name: "",
  role: "",
  department: "",
  categoryId: "",
  sortOrder: 0,
  published: true,
  photo: null,
};

function toForm(row) {
  return {
    name: row.name ?? "",
    role: row.role ?? "",
    department: row.department ?? "",
    categoryId: String(row.category?.id ?? row.categoryId ?? ""),
    sortOrder: row.sortOrder ?? 0,
    published: row.published !== false,
    photo: null,
  };
}

function toPayload(form) {
  return {
    name: form.name.trim(),
    role: form.role.trim(),
    department: optionalString(form.department),
    categoryId: Number(form.categoryId),
    sortOrder: Number(form.sortOrder) || 0,
    published: form.published,
  };
}

export default function StaffPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, meta, loading, error, reload } = useAsyncData(
    () => listStaff({ page, limit: 20, search: search || undefined, category: categoryFilter || undefined }),
    [page, search, categoryFilter]
  );
  const categories = useAsyncData(() => listStaffCategories(), []);
  const departments = useAsyncData(() => listFacultyDepartments(), []);

  function openCreate() {
    setEditId(null);
    setExistingPhoto(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(row) {
    setEditId(row.id);
    setExistingPhoto(row.image ?? null);
    setForm(toForm(row));
    setOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = toPayload(form);
      if (editId) {
        await updateStaff(editId, payload, form.photo);
        toast.success("Staff updated");
      } else {
        await createStaff(payload, form.photo);
        toast.success("Staff member added");
      }
      setOpen(false);
      setForm(emptyForm);
      setEditId(null);
      setExistingPhoto(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this staff member?")) return;
    try {
      await deleteStaff(id);
      toast.success("Staff deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleCategoryFilter = useCallback((e) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  }, []);

  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle="Administrative and support staff members"
        actions={
          <button type="button" className="btn btn-sm bg-[var(--color-brand-primary)] text-white" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Staff
          </button>
        }
      />

      <div className="card-surface mb-4 flex flex-wrap items-center gap-3 p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by name, role, or department..."
            value={search}
            onChange={handleSearch}
            className="input input-bordered input-sm w-full rounded-xl border-[var(--border-subtle)] bg-[var(--color-surface)] pl-9"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={handleCategoryFilter}
          className="select select-bordered select-sm w-auto rounded-xl border-[var(--border-subtle)] bg-[var(--color-surface)]"
        >
          <option value="">All Categories</option>
          {categories.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {meta?.total != null && (
          <span className="text-sm text-[var(--text-muted)]">
            {meta.total} staff member{meta.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="card-surface p-4">
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : loading ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-xs uppercase text-[var(--text-muted)]">
                    <th className="w-[56px]">Photo</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Category</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th className="w-[100px]" />
                  </tr>
                </thead>
                <tbody>
                  {data?.length ? (
                    data.map((row) => (
                      <tr key={row.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td>
                          {row.image ? (
                            <img
                              src={row.image}
                              alt={row.name}
                              className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--border-subtle)]"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
                              <UserCircle className="h-5 w-5 text-[var(--text-muted)]" />
                            </div>
                          )}
                        </td>
                        <td>
                          <div>
                            <p className="font-semibold">{row.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">#{row.id}</p>
                          </div>
                        </td>
                        <td>{row.role}</td>
                        <td>
                          {row.category?.name ? (
                            <span className="badge badge-sm badge-ghost">{row.category.name}</span>
                          ) : (
                            <span className="text-[var(--text-muted)]">—</span>
                          )}
                        </td>
                        <td>{row.department ?? "—"}</td>
                        <td>
                          {row.published ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Draft
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="flex gap-1">
                            <button type="button" className="btn btn-ghost btn-xs" onClick={() => openEdit(row)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" className="btn btn-ghost btn-xs text-rose-600" onClick={() => handleDelete(row.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-14 text-center text-[var(--text-muted)]">
                        {search || categoryFilter ? "No staff match your filters" : "No staff members yet"}
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

      <Modal open={open} title={editId ? "Edit Staff" : "Add Staff"} onClose={() => setOpen(false)} wide>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection title="Staff details">
            <div className="flex gap-5">
              <div className="flex shrink-0 flex-col items-center gap-2">
                {form.photo ? (
                  <img
                    src={URL.createObjectURL(form.photo)}
                    alt="Preview"
                    className="h-20 w-20 rounded-xl object-cover ring-2 ring-[var(--color-brand-primary)]"
                  />
                ) : existingPhoto ? (
                  <img
                    src={existingPhoto}
                    alt="Current"
                    className="h-20 w-20 rounded-xl object-cover ring-2 ring-[var(--border-subtle)]"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5">
                    <UserCircle className="h-8 w-8 text-[var(--text-muted)]" />
                  </div>
                )}
                <label className="btn btn-xs btn-outline cursor-pointer">
                  <Upload className="h-3 w-3" />
                  {form.photo ? form.photo.name : existingPhoto ? "Change photo" : "Upload photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ position: "absolute", width: 0, height: 0, opacity: 0, overflow: "hidden" }}
                    onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] ?? null })}
                  />
                </label>
                {form.photo && (
                  <button
                    type="button"
                    className="text-xs text-rose-500 hover:underline"
                    onClick={() => setForm({ ...form, photo: null })}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <FormField label="Full name *">
                  <FormInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} minLength={2} required />
                </FormField>
                <FormField label="Role / position *">
                  <FormInput value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} minLength={2} required placeholder="Office Assistant" />
                </FormField>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Category *">
                <FormSelect value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
                  <option value="">Select category</option>
                  {categories.data?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField label="Department">
                <FormSelect value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                  <option value="">Select department</option>
                  {departments.data?.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Display settings">
            <div className="flex flex-wrap items-center gap-6">
              <FormField label="Sort order">
                <FormInput type="number" min="0" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
              </FormField>
              <FormCheckbox label="Published on website" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            </div>
          </FormSection>

          <FormActions onCancel={() => setOpen(false)} loading={saving} submitLabel={editId ? "Update" : "Add"} />
        </form>
      </Modal>
    </div>
  );
}
