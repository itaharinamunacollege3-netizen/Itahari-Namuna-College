import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { Images, Pencil, Plus, Search, Star, Trash2, Upload } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, meta, loading, error, reload } = useAsyncData(
    () => listGalleryAlbums({ page, limit: 12, search: search || undefined }),
    [page, search]
  );

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
    setUploadingCover(true);
    try {
      await uploadAlbumCover(manageId, coverFile);
      toast.success("Cover uploaded");
      setCoverFile(null);
      await openManage(manageId);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleUploadImages() {
    if (!manageId || !imageFiles.length) return;
    setUploadingImages(true);
    try {
      await uploadAlbumImages(manageId, imageFiles);
      toast.success("Images uploaded");
      setImageFiles([]);
      await openManage(manageId);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploadingImages(false);
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

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

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

      {/* Search bar */}
      <div className="card-surface mb-4 flex flex-wrap items-center gap-3 p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search albums by title or description..."
            value={search}
            onChange={handleSearch}
            className="input input-bordered input-sm w-full rounded-xl border-[var(--border-subtle)] bg-[var(--color-surface)] pl-9"
          />
        </div>
        {meta?.total != null && (
          <span className="text-sm text-[var(--text-muted)]">
            {meta.total} album{meta.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Album grid */}
      <div className="card-surface p-4">
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : loading ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data?.length ? (
                data.map((item) => (
                  <div key={item.id} className="group overflow-hidden rounded-xl border border-[var(--border-subtle)] transition-shadow hover:shadow-md">
                    {item.coverImage ? (
                      <div className="relative h-40 overflow-hidden">
                        <img src={item.coverImage} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        {item.isFeatured && (
                          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-xs font-semibold text-white">
                            <Star className="h-3 w-3" />
                            Featured
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-slate-100 text-[var(--text-muted)] dark:bg-white/5">
                        <Images className="h-8 w-8" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold">{item.title}</h3>
                          <div className="mt-1 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                            <span>{item.images?.length ?? 0} images</span>
                            <span>·</span>
                            {item.published ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button type="button" className="btn btn-ghost btn-xs" title="Manage images" onClick={() => openManage(item.id)}>
                            <Upload className="h-3.5 w-3.5" />
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
                  </div>
                ))
              ) : (
                <p className="col-span-full py-14 text-center text-[var(--text-muted)]">
                  {search ? "No albums match your search" : "No albums found. Create your first album!"}
                </p>
              )}
            </div>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Create / Edit Album Modal */}
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
              <FormHint>Lowercase letters, numbers, and hyphens only. Auto-generated from title if blank.</FormHint>
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

      {/* Manage Album Images Modal */}
      <Modal open={Boolean(manageId)} title={album?.title ? `Manage: ${album.title}` : "Manage Album"} onClose={() => { setManageId(null); setAlbum(null); }} wide="xl">
        {album ? (
          <div className="space-y-6">
            {/* Cover image section */}
            <div>
              <p className="mb-2 text-sm font-semibold text-[var(--color-brand-dark)]">Cover image</p>
              {album.coverImage ? (
                <img src={album.coverImage} alt="" className="mb-3 h-36 w-full rounded-lg object-cover" />
              ) : (
                <div className="mb-3 flex h-24 items-center justify-center rounded-lg border border-dashed border-[var(--border-subtle)] bg-slate-50 text-sm text-[var(--text-muted)] dark:bg-white/5">
                  No cover image set
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <label className="btn btn-sm btn-outline cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  {coverFile ? coverFile.name : "Choose cover"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ position: "absolute", width: 0, height: 0, opacity: 0, overflow: "hidden" }}
                    onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <button type="button" className="btn btn-sm bg-[var(--color-brand-primary)] text-white" disabled={!coverFile || uploadingCover} onClick={handleUploadCover}>
                  {uploadingCover ? <span className="loading loading-spinner loading-xs" /> : null}
                  Upload cover
                </button>
              </div>
            </div>

            {/* Album images section */}
            <div>
              <p className="mb-2 text-sm font-semibold text-[var(--color-brand-dark)]">
                Album images ({album.images?.length ?? 0})
              </p>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <label className="btn btn-sm btn-outline cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  {imageFiles.length ? `${imageFiles.length} file(s) selected` : "Choose images"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    style={{ position: "absolute", width: 0, height: 0, opacity: 0, overflow: "hidden" }}
                    onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
                  />
                </label>
                <button type="button" className="btn btn-sm bg-[var(--color-brand-primary)] text-white" disabled={!imageFiles.length || uploadingImages} onClick={handleUploadImages}>
                  {uploadingImages ? <span className="loading loading-spinner loading-xs" /> : null}
                  Upload {imageFiles.length ? `${imageFiles.length} image(s)` : "images"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {album.images?.length ? album.images.map((img) => (
                  <div key={img.id} className="group relative overflow-hidden rounded-lg border border-[var(--border-subtle)]">
                    <img src={img.imageUrl} alt={img.caption ?? ""} className="aspect-square w-full object-cover transition-transform group-hover:scale-105" />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="truncate text-xs text-white">{img.caption}</p>
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-xs absolute right-1 top-1 bg-white/90 text-rose-600 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => handleDeleteImage(img.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )) : (
                  <p className="col-span-full py-6 text-center text-sm text-[var(--text-muted)]">
                    No images in this album yet. Upload some above!
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-10">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}
      </Modal>
    </div>
  );
}
