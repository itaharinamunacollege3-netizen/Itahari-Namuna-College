import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2, GripVertical } from "lucide-react";
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
  BLOG_ACCENT_COLORS,
  BLOG_CATEGORIES,
  BLOG_FIELD_HINTS,
  EMPTY_BLOG_SECTION,
} from "@/constants/blogs";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  createBlog,
  deleteBlog,
  getBlog,
  listBlogs,
  removeBlogCover,
  updateBlog,
} from "@/services/blogs.service";
import { optionalString } from "@/utils/formHelpers";
import { formatDate } from "@/utils/format";

const emptyForm = {
  title: "",
  excerpt: "",
  intro: "",
  category: "Education",
  author: "",
  authorRole: "",
  readTime: "5 min read",
  accentColor: "#045d30",
  sections: [{ ...EMPTY_BLOG_SECTION }],
  calloutHeading: "",
  calloutBody: "",
  tags: "",
  slug: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  sortOrder: 0,
  featured: false,
  isPopular: false,
  published: true,
  removeCover: false,
  removeAttachment: false,
  cover: null,
  attachment: null,
};

function sectionsToForm(sections) {
  if (!Array.isArray(sections) || !sections.length) {
    return [{ ...EMPTY_BLOG_SECTION }];
  }
  return sections.map((section) => ({
    heading: section.heading ?? "",
    body: section.body ?? "",
    bullets: Array.isArray(section.bullets) ? section.bullets.join(", ") : "",
  }));
}

function toForm(blog) {
  return {
    title: blog.title ?? "",
    excerpt: blog.excerpt ?? "",
    intro: blog.intro ?? "",
    category: blog.category ?? "Education",
    author: blog.author ?? "",
    authorRole: blog.authorRole ?? "",
    readTime: blog.readTime ?? "5 min read",
    accentColor: blog.accentColor ?? "#045d30",
    sections: sectionsToForm(blog.sections),
    calloutHeading: blog.callout?.heading ?? "",
    calloutBody: blog.callout?.body ?? "",
    tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
    slug: blog.slug ?? "",
    publishedAt: blog.publishedAt?.slice?.(0, 10) ?? new Date().toISOString().slice(0, 10),
    sortOrder: blog.sortOrder ?? 0,
    featured: Boolean(blog.featured),
    isPopular: Boolean(blog.isPopular),
    published: blog.published !== false,
    removeCover: false,
    removeAttachment: false,
    cover: null,
    attachment: null,
  };
}

function toPayload(form) {
  const sections = form.sections
    .map((section) => {
      const heading = section.heading.trim();
      const body = section.body.trim();
      if (!heading || !body) return null;
      const bullets = section.bullets
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      return bullets.length ? { heading, body, bullets } : { heading, body };
    })
    .filter(Boolean);

  const calloutHeading = form.calloutHeading.trim();
  const calloutBody = form.calloutBody.trim();

  return {
    title: form.title.trim(),
    excerpt: form.excerpt.trim(),
    intro: form.intro.trim(),
    category: form.category.trim(),
    author: form.author.trim(),
    authorRole: optionalString(form.authorRole),
    readTime: form.readTime.trim() || "5 min read",
    accentColor: form.accentColor,
    sections,
    callout:
      calloutHeading && calloutBody
        ? { heading: calloutHeading, body: calloutBody }
        : null,
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    slug: optionalString(form.slug),
    publishedAt: form.publishedAt,
    sortOrder: Number(form.sortOrder) || 0,
    featured: form.featured,
    isPopular: form.isPopular,
    published: form.published,
    removeCover: form.removeCover,
    removeAttachment: form.removeAttachment,
  };
}

export default function BlogsPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsyncData(
    () => listBlogs({ limit: 50 }),
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
      const { data: blog } = await getBlog(id);
      setEditId(id);
      setExisting(blog);
      setForm(toForm(blog));
      setOpen(true);
    } catch (err) {
      toast.error(err.message);
    }
  }

  function updateSection(index, field, value) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  }

  function addSection() {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { ...EMPTY_BLOG_SECTION }],
    }));
  }

  function removeSection(index) {
    setForm((prev) => ({
      ...prev,
      sections:
        prev.sections.length <= 1
          ? [{ ...EMPTY_BLOG_SECTION }]
          : prev.sections.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (form.excerpt.trim().length < 10) {
      toast.error("Excerpt must be at least 10 characters");
      return;
    }
    if (form.intro.trim().length < 10) {
      toast.error("Intro must be at least 10 characters");
      return;
    }
    if (!form.author.trim()) {
      toast.error("Author is required");
      return;
    }

    const payload = toPayload(form);
    if (!payload.sections.length) {
      toast.error("At least one complete section is required");
      return;
    }

    setSaving(true);
    const files = { cover: form.cover, attachment: form.attachment };

    try {
      if (editId) {
        await updateBlog(editId, payload, files);
        toast.success("Blog post updated");
      } else {
        await createBlog(payload, files);
        toast.success("Blog post created");
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
    if (!confirm("Delete this blog post?")) return;
    try {
      await deleteBlog(id);
      toast.success("Blog post deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleRemoveCover() {
    if (!editId || !confirm("Remove cover image?")) return;
    try {
      await removeBlogCover(editId);
      toast.success("Cover image removed");
      const { data: blog } = await getBlog(editId);
      setExisting(blog);
      setForm((prev) => ({ ...prev, removeCover: false }));
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleRemoveAttachment() {
    if (!editId || !confirm("Remove attachment?")) return;
    try {
      const response = await fetch(`/api/admin/blogs/${editId}/attachment`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to remove attachment");
      toast.success("Attachment removed");
      const { data: blog } = await getBlog(editId);
      setExisting(blog);
      setForm((prev) => ({ ...prev, removeAttachment: false }));
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        subtitle="Manage publications shown on the public blog"
        actions={
          <Button type="button" size="sm" variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Blog Post
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
                <DataTableHeaderCell>Author</DataTableHeaderCell>
                <DataTableHeaderCell>Date</DataTableHeaderCell>
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
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1">{row.excerpt}</p>
                      {row.tags?.length ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {row.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="badge badge-ghost badge-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </DataTableCell>
                    <DataTableCell>{row.category ?? "—"}</DataTableCell>
                    <DataTableCell>{row.author ?? "—"}</DataTableCell>
                    <DataTableCell>{formatDate(row.publishedAt || row.date)}</DataTableCell>
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
                        {row.isPopular ? (
                          <span className="badge badge-info badge-sm">Popular</span>
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
                <DataTableEmpty colSpan={6}>No blog posts found</DataTableEmpty>
              )}
            </DataTableBody>
          </DataTable>
        )}
      </Card>

      <Modal
        open={open}
        title={editId ? "Edit Blog Post" : "Create Blog Post"}
        onClose={() => setOpen(false)}
        wide="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection title="Basic information">
            <FormField label="Title *">
              <FormInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                minLength={3}
                required
              />
              <FormHint>{BLOG_FIELD_HINTS.title}</FormHint>
            </FormField>

            <FormField label="Excerpt *">
              <FormTextarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={3}
                required
              />
              <FormHint>{BLOG_FIELD_HINTS.excerpt}</FormHint>
            </FormField>

            <FormField label="Intro / lead paragraph *">
              <FormTextarea
                value={form.intro}
                onChange={(e) => setForm({ ...form, intro: e.target.value })}
                rows={4}
                required
              />
              <FormHint>{BLOG_FIELD_HINTS.intro}</FormHint>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Category *">
                <FormSelect
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                >
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </FormSelect>
              </FormField>

              <FormField label="Accent color">
                <FormSelect
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                >
                  {BLOG_ACCENT_COLORS.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Author & metadata">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Author *">
                <FormInput
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Author role">
                <FormInput
                  value={form.authorRole}
                  onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                  placeholder="Head of Academic Affairs"
                />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Read time">
                <FormInput
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  placeholder="5 min read"
                />
              </FormField>

              <FormField label="Published date">
                <FormInput
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                />
              </FormField>

              <FormField label="Sort order">
                <FormInput
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="Tags">
              <FormInput
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Education, Career Readiness"
              />
              <FormHint>{BLOG_FIELD_HINTS.tags}</FormHint>
            </FormField>

            <FormField label="Slug">
              <FormInput
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="experiential-learning-higher-education"
              />
              <FormHint>{BLOG_FIELD_HINTS.slug}</FormHint>
            </FormField>
          </FormSection>

          <FormSection title="Article sections">
            <div className="space-y-4">
              {form.sections.map((section, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-[var(--border-subtle)] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
                      <GripVertical className="h-4 w-4" />
                      Section {index + 1}
                    </div>
                    <Button
                      type="button"
                      size="xs"
                      variant="ghost"
                      onClick={() => removeSection(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <FormField label="Heading *">
                    <FormInput
                      value={section.heading}
                      onChange={(e) => updateSection(index, "heading", e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Body *">
                    <FormTextarea
                      value={section.body}
                      onChange={(e) => updateSection(index, "body", e.target.value)}
                      rows={4}
                      required
                    />
                  </FormField>

                  <FormField label="Bullet points (comma-separated)">
                    <FormInput
                      value={section.bullets}
                      onChange={(e) => updateSection(index, "bullets", e.target.value)}
                      placeholder="Point one, Point two"
                    />
                  </FormField>
                </div>
              ))}
            </div>

            <Button type="button" size="sm" variant="ghost" onClick={addSection}>
              <Plus className="h-4 w-4" />
              Add section
            </Button>
            <FormHint>{BLOG_FIELD_HINTS.sections}</FormHint>
          </FormSection>

          <FormSection title="Callout box (optional)">
            <FormField label="Callout heading">
              <FormInput
                value={form.calloutHeading}
                onChange={(e) => setForm({ ...form, calloutHeading: e.target.value })}
              />
            </FormField>
            <FormField label="Callout body">
              <FormTextarea
                value={form.calloutBody}
                onChange={(e) => setForm({ ...form, calloutBody: e.target.value })}
                rows={3}
              />
            </FormField>
          </FormSection>

          <FormSection title="Attachments">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Cover image">
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setForm({ ...form, cover: e.target.files?.[0] ?? null })}
                />
              </FormField>

              <FormField label="Attachment (PDF)">
                <input
                  type="file"
                  accept="application/pdf"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setForm({ ...form, attachment: e.target.files?.[0] ?? null })}
                />
              </FormField>
            </div>

            {editId && (existing?.coverImage || existing?.attachmentUrl) ? (
              <div className="space-y-3 rounded-lg border border-[var(--border-subtle)] p-3">
                <p className="text-sm font-medium">Current files</p>
                <div className="space-y-3">
                  {existing?.coverImage ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <img
                        src={existing.coverImage}
                        alt=""
                        className="h-20 w-32 rounded object-cover"
                      />
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost text-rose-600"
                        onClick={handleRemoveCover}
                      >
                        Remove cover
                      </button>
                      <FormCheckbox
                        label="Remove cover on save"
                        checked={form.removeCover}
                        onChange={(e) => setForm({ ...form, removeCover: e.target.checked })}
                      />
                    </div>
                  ) : null}
                  {existing?.attachmentUrl ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={existing.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="link link-primary text-sm"
                      >
                        View attachment
                      </a>
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost text-rose-600"
                        onClick={handleRemoveAttachment}
                      >
                        Remove attachment
                      </button>
                      <FormCheckbox
                        label="Remove attachment on save"
                        checked={form.removeAttachment}
                        onChange={(e) => setForm({ ...form, removeAttachment: e.target.checked })}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </FormSection>

          <FormSection title="Visibility">
            <div className="space-y-3">
              <FormCheckbox
                label="Featured post (hero section on blog page)"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              <FormHint>{BLOG_FIELD_HINTS.featured}</FormHint>

              <FormCheckbox
                label="Popular post (sidebar list)"
                checked={form.isPopular}
                onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
              />
              <FormHint>{BLOG_FIELD_HINTS.isPopular}</FormHint>

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
