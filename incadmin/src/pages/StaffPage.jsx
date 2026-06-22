import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2, Upload, UserCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FilterSelect, SearchInput } from "@/components/ui/Filters";
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
  FormCheckbox,
  FormSection,
  FormActions,
} from "@/components/ui/Modal";
import { useAsyncData } from "@/hooks/useAsyncData";
import { listStaffCategories } from "@/services/categories.service";
import { createStaff, deleteStaff, listStaff, updateStaff } from "@/services/staff.service";

const emptyForm = {
  name: "",
  role: "",
  categoryId: "",
  sortOrder: 0,
  published: true,
  photo: null,
};

function toForm(row) {
  return {
    name: row.name ?? "",
    role: row.role ?? "",
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
          <Button type="button" size="sm" variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Staff
          </Button>
        }
      />

      <Card className="mb-4 flex flex-wrap items-center gap-3 p-4">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Search by name or role..."
          className="min-w-[200px] flex-1"
        />
        <FilterSelect
          value={categoryFilter}
          onChange={handleCategoryFilter}
          className="w-auto"
        >
          <option value="">All Categories</option>
          {categories.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </FilterSelect>
        {meta?.total != null && (
          <span className="text-sm text-[var(--text-muted)]">
            {meta.total} staff member{meta.total !== 1 ? "s" : ""}
          </span>
        )}
      </Card>

      <Card className="p-4">
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : loading ? (
          <TableSkeleton />
        ) : (
          <>
            <DataTable>
              <DataTableHead>
                <DataTableRow className="text-xs uppercase text-[var(--text-muted)]">
                  <DataTableHeaderCell className="w-[56px]">Photo</DataTableHeaderCell>
                  <DataTableHeaderCell>Name</DataTableHeaderCell>
                  <DataTableHeaderCell>Role</DataTableHeaderCell>
                  <DataTableHeaderCell>Category</DataTableHeaderCell>

                  <DataTableHeaderCell>Status</DataTableHeaderCell>
                  <DataTableHeaderCell className="w-[100px]" />
                </DataTableRow>
              </DataTableHead>
              <DataTableBody>
                {data?.length ? (
                  data.map((row) => (
                    <DataTableRow key={row.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <DataTableCell>
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
                      </DataTableCell>
                      <DataTableCell>
                          <div>
                            <p className="font-semibold">{row.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">#{row.id}</p>
                          </div>
                      </DataTableCell>
                      <DataTableCell>{row.role}</DataTableCell>
                      <DataTableCell>
                          {row.category?.name ? (
                            <span className="badge badge-sm badge-ghost">{row.category.name}</span>
                          ) : (
                            <span className="text-[var(--text-muted)]">—</span>
                          )}
                      </DataTableCell>

                      <DataTableCell>
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
                      </DataTableCell>
                      <DataTableCell>
                          <div className="flex gap-1">
                            <Button type="button" size="xs" variant="ghost" onClick={() => openEdit(row)}>
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
                  <DataTableEmpty colSpan={6} className="py-14">
                    {search || categoryFilter ? "No staff match your filters" : "No staff members yet"}
                  </DataTableEmpty>
                )}
              </DataTableBody>
            </DataTable>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </Card>

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
