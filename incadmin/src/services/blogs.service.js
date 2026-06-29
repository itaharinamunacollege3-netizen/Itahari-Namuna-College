import { apiRequest, apiFormRequest, buildQuery } from "./apiClient";

function buildBlogFormData(data, files) {
  const form = new FormData();
  const entries = {
    title: data.title,
    excerpt: data.excerpt,
    intro: data.intro,
    category: data.category,
    author: data.author,
    authorRole: data.authorRole ?? "",
    readTime: data.readTime ?? "5 min read",
    accentColor: data.accentColor ?? "#045d30",
    sections: JSON.stringify(data.sections ?? []),
    callout: data.callout ? JSON.stringify(data.callout) : "",
    tags: JSON.stringify(data.tags ?? []),
    slug: data.slug ?? "",
    featured: String(Boolean(data.featured)),
    isPopular: String(Boolean(data.isPopular)),
    published: String(data.published !== false),
    publishedAt: data.publishedAt ?? "",
    sortOrder: String(data.sortOrder ?? 0),
    removeCover: String(Boolean(data.removeCover)),
    removeAttachment: String(Boolean(data.removeAttachment)),
  };

  Object.entries(entries).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value);
    }
  });

  if (files?.cover) form.append("cover", files.cover);
  if (files?.attachment) form.append("attachment", files.attachment);
  if (files?.sectionImages) {
    files.sectionImages.forEach((file, index) => {
      if (file) form.append(`sectionImages[${index}]`, file);
    });
  }
  return form;
}

export async function listBlogs(params) {
  return apiRequest(`/admin/blogs${buildQuery(params ?? {})}`);
}

export async function getBlog(id) {
  return apiRequest(`/admin/blogs/${id}`);
}

export async function createBlog(data, files) {
  const hasFiles = files?.cover || files?.attachment || (files?.sectionImages?.some(file => file));
  if (hasFiles) {
    return apiFormRequest("/admin/blogs", buildBlogFormData(data, files));
  }
  return apiRequest("/admin/blogs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBlog(id, data, files) {
  const hasFiles = files?.cover || files?.attachment || (files?.sectionImages?.some(file => file));
  if (hasFiles) {
    return apiFormRequest(`/admin/blogs/${id}`, buildBlogFormData(data, files), "PATCH");
  }
  return apiRequest(`/admin/blogs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteBlog(id) {
  return apiRequest(`/admin/blogs/${id}`, { method: "DELETE" });
}

export async function removeBlogCover(id) {
  return apiRequest(`/admin/blogs/${id}/cover`, { method: "DELETE" });
}
