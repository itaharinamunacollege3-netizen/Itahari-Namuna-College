import { useState } from "react";
import toast from "react-hot-toast";
import { Images, Pencil, Plus, Trash2 } from "lucide-react";
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
  createGalleryAlbum,
  deleteGalleryAlbum,
  deleteGalleryImage,
  getGalleryAlbum,
  listGalleryAlbums,
  updateGalleryAlbum,
  uploadAlbumCover,
  uploadAlbumImages,
} from "@/services/gallery.service";
import { optionalString } from "@/utils/formHelpers";

const emptyForm = {
  title: "",
  description: "",
  slug: "",
  isFeatured: false,
  sortOrder: 0,
  published: true,
};

function toForm(item) {
  return {
    title: item.title ?? "",
    description: item.description ?? "",
    slug: item.slug ?? "",
    isFeatured: Boolean(item.isFeatured),
    sortOrder: item.sortOrder ?? 0,
    published: item.published !== false,
  };
}

function toPayload(form) {
  return {
    title: form.title.trim(),
    description: optionalString(form.description),
    slug: optionalString(form.slug),
    isFeatured: form.isFeatured,
    sortOrder: Number(form.sortOrder) || 0,
    published: form.published,
  };
}

export default function GalleryPage() {
  const [open, setOpen] = useState(false);
  const [manageId, setManageId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [album, setAlbum] = useState(null);
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  const { data, loading, error, reload } = useAsyncData(() => listGalleryAlbums(), []);

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(item) {
    setEditId(item.id);
    setForm(toForm(item));
    setOpen(true);
  }

  async function openManage(id) {
    try {
      const { data: detail } = await getGalleryAlbum(id);
      setAlbum(detail);
      setManageId(id);
      setCoverFile(null);
      setImageFiles([]);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = toPayload(form);
    try {
      if (editId) {
        await updateGalleryAlbum(editId, payload);
        toast.success("Album updated");
      } else {
        await createGalleryAlbum(payload);
        toast.success("Album created");
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
    if (!confirm("Delete this album and all its images?")) return;
    try {
      await deleteGalleryAlbum(id);
      toast.success("Album deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleUploadCover() {
    if (!manageId || !coverFile) return;
    setSaving(true);
    try {
      await uploadAlbumCover(manageId, coverFile);
      toast.success("Cover uploaded");
      await openManage(manageId);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUploadImages() {
    if (!manageId || !imageFiles.length) return;
    setSaving(true);
    try {
      await uploadAlbumImages(manageId, imageFiles);
      toast.success("Images uploaded");
      setImageFiles([]);
      await openManage(manageId);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteImage(imageId) {
    if (!manageId || !confirm("Delete this image?")) return;
    try {
      await deleteGalleryImage(manageId, imageId);
      toast.success("Image deleted");
      await openManage(manageId);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Gallery"
        subtitle="Photo albums and events"
        actions={
          <button type="button" className="btn btn-sm bg-[var(--color-brand-primary)] text-white" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Album
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
              data.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={item.title} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-slate-100 text-[var(--text-muted)] dark:bg-white/5">No cover</div>
                  )}
                  <div className="flex items-start justify-between p-4">
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">{item.images?.length ?? 0} images</p>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" className="btn btn-ghost btn-xs" title="Manage images" onClick={() => openManage(item.id)}>
                        <Images className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" className="btn btn-ghost btn-xs" onClick={() => openEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" className="btn btn-ghost btn-xs text-rose-600" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full py-10 text-center text-[var(--text-muted)]">No albums found</p>
            )}
          </div>
        )}
      </div>

      <Modal open={open} title={editId ? "Edit Album" : "Create Album"} onClose={() => setOpen(false)} wide>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection title="Album details">
            <FormField label="Title *">
              <FormInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} minLength={2} required />
            </FormField>
            <FormField label="Description">
              <FormTextarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={1000} />
              <FormHint>Max 1000 characters</FormHint>
            </FormField>
            <FormField label="Slug">
              <FormInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="annual-day-2026" />
              <FormHint>Lowercase letters, numbers, and hyphens only</FormHint>
            </FormField>
          </FormSection>

          <FormSection title="Display settings">
            <FormField label="Sort order">
              <FormInput type="number" min="0" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </FormField>
            <div className="flex flex-wrap gap-6">
              <FormCheckbox label="Featured album" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              <FormCheckbox label="Published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            </div>
          </FormSection>

          <FormActions onCancel={() => setOpen(false)} loading={saving} submitLabel={editId ? "Update" : "Create"} />
        </form>
      </Modal>

      <Modal open={Boolean(manageId)} title={album?.title ? `Manage: ${album.title}` : "Manage Album"} onClose={() => { setManageId(null); setAlbum(null); }} wide>
        {album ? (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium">Cover image</p>
              {album.coverImage ? (
                <img src={album.coverImage} alt="" className="mb-3 h-32 w-full rounded-lg object-cover" />
              ) : null}
              <div className="flex flex-wrap gap-2">
                <input type="file" accept="image/*" className="file-input file-input-bordered file-input-sm" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
                <button type="button" className="btn btn-sm" disabled={!coverFile || saving} onClick={handleUploadCover}>Upload cover</button>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Album images</p>
              <div className="mb-3 flex flex-wrap gap-2">
                <input type="file" accept="image/*" multiple className="file-input file-input-bordered file-input-sm" onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))} />
                <button type="button" className="btn btn-sm" disabled={!imageFiles.length || saving} onClick={handleUploadImages}>Upload images</button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {album.images?.length ? album.images.map((img) => (
                  <div key={img.id} className="relative overflow-hidden rounded-lg border border-[var(--border-subtle)]">
                    <img src={img.url} alt={img.caption ?? ""} className="aspect-square w-full object-cover" />
                    <button type="button" className="btn btn-xs absolute right-1 top-1 bg-white/90 text-rose-600" onClick={() => handleDeleteImage(img.id)}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )) : (
                  <p className="col-span-full text-sm text-[var(--text-muted)]">No images in this album yet</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <span className="loading loading-spinner" />
        )}
      </Modal>
    </div>
  );
}
