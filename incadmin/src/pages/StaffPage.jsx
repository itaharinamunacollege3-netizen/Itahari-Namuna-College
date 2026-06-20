import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TableSkeleton } from "@/components/ui/Skeleton";
import {
  Modal,
  FormField,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormHint,
  FormSection,
  FormActions,
} from "@/components/ui/Modal";
import { useAsyncData } from "@/hooks/useAsyncData";
import { listStaffCategories } from "@/services/categories.service";
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
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsyncData(() => listStaff(), []);
  const categories = useAsyncData(() => listStaffCategories(), []);

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(row) {
    setEditId(row.id);
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

  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle="Administrative and support staff"
        actions={
          <button type="button" className="btn btn-sm bg-[var(--color-brand-primary)] text-white" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Staff
          </button>
        }
      />

      <div className="card-surface p-4">
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : loading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="text-xs uppercase text-[var(--text-muted)]">
                  <th>Name</th>
                  <th>Role</th>
                  <th>Category</th>
                  <th>Department</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data?.length ? (
                  data.map((row) => (
                    <tr key={row.id}>
                      <td className="font-medium">{row.name}</td>
                      <td>{row.role}</td>
                      <td>{row.category?.name ?? "—"}</td>
                      <td>{row.department ?? "—"}</td>
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
                    <td colSpan={5} className="py-10 text-center text-[var(--text-muted)]">No staff found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={open} title={editId ? "Edit Staff" : "Add Staff"} onClose={() => setOpen(false)} wide>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection title="Staff details">
            <FormField label="Full name *">
              <FormInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} minLength={2} required />
            </FormField>
            <FormField label="Role / position *">
              <FormInput value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} minLength={2} required placeholder="Office Assistant" />
            </FormField>
            <FormField label="Category *">
              <FormSelect value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
                <option value="">Select category</option>
                {categories.data?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </FormSelect>
            </FormField>
            <FormField label="Department">
              <FormInput value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Administration" />
            </FormField>
            <FormField label="Photo">
              <input type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] ?? null })} />
              <FormHint>Upload staff portrait (optional)</FormHint>
            </FormField>
          </FormSection>

          <FormSection title="Display settings">
            <FormField label="Sort order">
              <FormInput type="number" min="0" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </FormField>
            <FormCheckbox label="Published on website" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          </FormSection>

          <FormActions onCancel={() => setOpen(false)} loading={saving} submitLabel={editId ? "Update" : "Add"} />
        </form>
      </Modal>
    </div>
  );
}
