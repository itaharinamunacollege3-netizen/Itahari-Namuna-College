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
  FormTextarea,
  FormCheckbox,
  FormHint,
  FormSection,
  FormActions,
} from "@/components/ui/Modal";
import { useAsyncData } from "@/hooks/useAsyncData";
import { listFacultyDepartments } from "@/services/categories.service";
import { createFaculty, deleteFaculty, listFaculty, updateFaculty } from "@/services/faculty.service";
import { optionalString } from "@/utils/formHelpers";

const emptyForm = {
  name: "",
  designation: "",
  departmentId: "",
  qualification: "",
  bio: "",
  isHOD: false,
  sortOrder: 0,
  published: true,
  photo: null,
};

function toForm(member) {
  return {
    name: member.name ?? "",
    designation: member.role ?? member.designation ?? "",
    departmentId: String(member.department?.id ?? member.departmentId ?? ""),
    qualification: member.qualification ?? "",
    bio: member.bio ?? "",
    isHOD: Boolean(member.isHOD),
    sortOrder: member.sortOrder ?? 0,
    published: member.published !== false,
    photo: null,
  };
}

function toPayload(form) {
  return {
    name: form.name.trim(),
    designation: form.designation.trim(),
    departmentId: Number(form.departmentId),
    qualification: optionalString(form.qualification),
    bio: optionalString(form.bio),
    isHOD: form.isHOD,
    sortOrder: Number(form.sortOrder) || 0,
    published: form.published,
  };
}

export default function FacultyPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsyncData(() => listFaculty(), []);
  const departments = useAsyncData(() => listFacultyDepartments(), []);

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(member) {
    setEditId(member.id);
    setForm(toForm(member));
    setOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = toPayload(form);
      if (editId) {
        await updateFaculty(editId, payload, form.photo);
        toast.success("Faculty updated");
      } else {
        await createFaculty(payload, form.photo);
        toast.success("Faculty member added");
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
    if (!confirm("Delete this faculty member?")) return;
    try {
      await deleteFaculty(id);
      toast.success("Faculty deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Faculty"
        subtitle="Teaching faculty members"
        actions={
          <button type="button" className="btn btn-sm bg-[var(--color-brand-primary)] text-white" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Faculty
          </button>
        }
      />

      <div className="card-surface p-4">
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : loading ? (
          <TableSkeleton />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data?.length ? (
              data.map((member) => (
                <div key={member.id} className="flex gap-4 rounded-xl border border-[var(--border-subtle)] p-4">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="h-16 w-16 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 font-bold dark:bg-white/5">{member.name.charAt(0)}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold">{member.name}</h3>
                        <p className="text-sm text-[var(--color-brand-primary)]">{member.role}</p>
                        <p className="text-xs text-[var(--text-muted)]">{member.department?.name ?? "—"}</p>
                      </div>
                      <div className="flex gap-1">
                        <button type="button" className="btn btn-ghost btn-xs" onClick={() => openEdit(member)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" className="btn btn-ghost btn-xs text-rose-600" onClick={() => handleDelete(member.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full py-10 text-center text-[var(--text-muted)]">No faculty found</p>
            )}
          </div>
        )}
      </div>

      <Modal open={open} title={editId ? "Edit Faculty" : "Add Faculty"} onClose={() => setOpen(false)} wide>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection title="Personal details">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full name *">
                <FormInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} minLength={2} required />
              </FormField>
              <FormField label="Designation *">
                <FormInput value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} minLength={2} required placeholder="Assistant Professor" />
              </FormField>
            </div>
            <FormField label="Department *">
              <FormSelect value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} required>
                <option value="">Select department</option>
                {departments.data?.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </FormSelect>
            </FormField>
            <FormField label="Qualification">
              <FormInput value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} placeholder="M.Sc., Ph.D." />
            </FormField>
            <FormField label="Bio">
              <FormTextarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </FormField>
            <FormField label="Photo">
              <input type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] ?? null })} />
              <FormHint>Upload faculty portrait (optional)</FormHint>
            </FormField>
          </FormSection>

          <FormSection title="Role & visibility">
            <FormField label="Sort order">
              <FormInput type="number" min="0" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </FormField>
            <div className="flex flex-wrap gap-6">
              <FormCheckbox label="Head of Department (HOD)" checked={form.isHOD} onChange={(e) => setForm({ ...form, isHOD: e.target.checked })} />
              <FormCheckbox label="Published on website" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            </div>
          </FormSection>

          <FormActions onCancel={() => setOpen(false)} loading={saving} submitLabel={editId ? "Update" : "Add"} />
        </form>
      </Modal>
    </div>
  );
}
