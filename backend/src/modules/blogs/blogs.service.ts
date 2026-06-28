import sanitizeHtml from "sanitize-html";
import { prisma } from "../../config/prisma";
import { uniqueSlug } from "../../utils/slug";
import { AppError } from "../../utils/apiResponse";
import {
  deleteCloudinaryAsset,
  uploadBlogCoverImage,
} from "../../services/cloudinary.service";
import { formatBlogDate, formatBlogDetail, formatBlogListItem } from "./blogs.formatter";
import type { BlogUploadFiles, BlogWriteInput, ListBlogsParams } from "./blogs.types";

function sanitizeText(value: string) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

function sanitizeSections(sections: BlogWriteInput["sections"]) {
  return sections.map((section) => ({
    heading: sanitizeText(section.heading),
    body: sanitizeText(section.body),
    ...(section.bullets?.length
      ? { bullets: section.bullets.map((bullet) => sanitizeText(bullet)) }
      : {}),
  }));
}

function sanitizeCallout(callout: BlogWriteInput["callout"]) {
  if (!callout) return null;
  return {
    heading: sanitizeText(callout.heading),
    body: sanitizeText(callout.body),
  };
}

function buildWhere(params: ListBlogsParams) {
  const where: Record<string, unknown> = {};
  if (params.publishedOnly !== false) where.published = true;
  if (params.category) where.category = params.category;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { excerpt: { contains: params.search, mode: "insensitive" } },
      { intro: { contains: params.search, mode: "insensitive" } },
      { author: { contains: params.search, mode: "insensitive" } },
    ];
  }
  return where;
}

function filterByTag<T extends { tags: unknown }>(items: T[], tag?: string) {
  if (!tag) return items;
  return items.filter((item) => {
    const tags = Array.isArray(item.tags) ? (item.tags as string[]) : [];
    return tags.some((t) => t.toLowerCase() === tag.toLowerCase());
  });
}

async function findBlogRecord(idOrSlug: string, publishedOnly = true) {
  const isNumeric = /^\d+$/.test(idOrSlug);
  const where: Record<string, unknown> = publishedOnly ? { published: true } : {};

  if (isNumeric) {
    return prisma.blogPost.findFirst({
      where: { ...where, id: Number(idOrSlug) },
    });
  }

  return prisma.blogPost.findFirst({
    where: { ...where, slug: idOrSlug },
  });
}

async function resolveCoverFields(
  data: Partial<BlogWriteInput>,
  files: BlogUploadFiles | undefined,
  blogSlug: string,
  existing?: { coverImage: string | null; coverImageCloudinaryId: string | null }
) {
  const result: Record<string, unknown> = {};

  if (data.removeCover) {
    if (existing?.coverImageCloudinaryId) {
      await deleteCloudinaryAsset(existing.coverImageCloudinaryId, "image");
    }
    result.coverImage = null;
    result.coverImageCloudinaryId = null;
  } else if (files?.cover) {
    if (existing?.coverImageCloudinaryId) {
      await deleteCloudinaryAsset(existing.coverImageCloudinaryId, "image");
    }
    const upload = await uploadBlogCoverImage(files.cover, blogSlug);
    result.coverImage = upload.url;
    result.coverImageCloudinaryId = upload.publicId;
  }

  return result;
}

async function deleteBlogAssets(post: { coverImageCloudinaryId: string | null }) {
  await deleteCloudinaryAsset(post.coverImageCloudinaryId, "image");
}

function mapWriteInputToDb(data: BlogWriteInput, coverFields: Record<string, unknown>) {
  const callout = sanitizeCallout(data.callout ?? null);

  return {
    title: data.title.trim(),
    excerpt: sanitizeText(data.excerpt),
    intro: sanitizeText(data.intro),
    category: data.category.trim(),
    author: data.author.trim(),
    authorRole: data.authorRole?.trim() || null,
    readTime: data.readTime?.trim() || "5 min read",
    accentColor: data.accentColor ?? "#045d30",
    sections: sanitizeSections(data.sections),
    ...(callout ? { callout } : {}),
    tags: data.tags,
    featured: data.featured ?? false,
    isPopular: data.isPopular ?? false,
    published: data.published ?? true,
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    sortOrder: data.sortOrder ?? 0,
    ...coverFields,
  };
}

export async function listBlogs(params: ListBlogsParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const where = buildWhere(params);

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  const filtered = filterByTag(items, params.tag);

  return {
    items: filtered.map(formatBlogListItem),
    meta: {
      page,
      limit,
      total: params.tag ? filtered.length : total,
      totalPages: Math.ceil((params.tag ? filtered.length : total) / limit),
    },
  };
}

export async function getBlogByIdentifier(idOrSlug: string, publishedOnly = true) {
  const post = await findBlogRecord(idOrSlug, publishedOnly);
  if (!post) throw new AppError(404, "Blog post not found");
  return formatBlogDetail(post);
}

export async function getBlogById(id: number, publishedOnly = true) {
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, "Invalid blog id");
  }

  const post = await prisma.blogPost.findFirst({
    where: { id, ...(publishedOnly ? { published: true } : {}) },
  });

  if (!post) throw new AppError(404, "Blog post not found");
  return formatBlogDetail(post);
}

export async function getFeaturedBlog() {
  const featured = await prisma.blogPost.findFirst({
    where: { published: true, featured: true },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
  });

  if (featured) return formatBlogListItem(featured);

  const newest = await prisma.blogPost.findFirst({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
  });

  if (!newest) throw new AppError(404, "No blog posts available");
  return formatBlogListItem(newest);
}

export async function getPopularBlogs(limit = 4) {
  const popular = await prisma.blogPost.findMany({
    where: { published: true, isPopular: true },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { id: "desc" }],
    take: limit,
  });

  if (popular.length > 0) return popular.map(formatBlogListItem);

  const fallback = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: limit,
  });

  return fallback.map(formatBlogListItem);
}

export async function getRelatedBlogs(excludeId: number, limit = 4) {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, id: { not: excludeId } },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: limit,
  });

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    category: post.category,
    date: formatBlogDate(post.publishedAt),
  }));
}

export async function incrementBlogViewCount(idOrSlug: string) {
  const post = await findBlogRecord(idOrSlug, true);
  if (!post) return;

  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });
}

export async function createBlog(data: BlogWriteInput, files?: BlogUploadFiles) {
  const slug =
    data.slug ||
    (await uniqueSlug(data.title, async (s) => !!(await prisma.blogPost.findUnique({ where: { slug: s } }))));

  const coverFields = await resolveCoverFields(data, files, slug);
  const dbData = mapWriteInputToDb(data, coverFields);

  const post = await prisma.$transaction(async (tx) => {
    if (dbData.featured) {
      await tx.blogPost.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
    }

    return tx.blogPost.create({
      data: { ...dbData, slug },
    });
  });

  return formatBlogDetail(post);
}

export async function updateBlog(
  id: number,
  data: Partial<BlogWriteInput>,
  files?: BlogUploadFiles
) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Blog post not found");

  const blogSlug =
    data.slug ||
    (data.title
      ? await uniqueSlug(data.title, async (s) => {
          const found = await prisma.blogPost.findUnique({ where: { slug: s } });
          return !!found && found.id !== id;
        })
      : existing.slug);

  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.excerpt !== undefined) updateData.excerpt = sanitizeText(data.excerpt);
  if (data.intro !== undefined) updateData.intro = sanitizeText(data.intro);
  if (data.category !== undefined) updateData.category = data.category.trim();
  if (data.author !== undefined) updateData.author = data.author.trim();
  if (data.authorRole !== undefined) updateData.authorRole = data.authorRole?.trim() || null;
  if (data.readTime !== undefined) updateData.readTime = data.readTime.trim();
  if (data.accentColor !== undefined) updateData.accentColor = data.accentColor;
  if (data.sections !== undefined) updateData.sections = sanitizeSections(data.sections);
  if (data.callout !== undefined) {
    const callout = sanitizeCallout(data.callout ?? null);
    updateData.callout = callout;
  }
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.isPopular !== undefined) updateData.isPopular = data.isPopular;
  if (data.published !== undefined) updateData.published = data.published;
  if (data.publishedAt !== undefined) updateData.publishedAt = new Date(data.publishedAt);
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

  if (data.slug) {
    updateData.slug = data.slug;
  } else if (data.title) {
    updateData.slug = blogSlug;
  }

  Object.assign(updateData, await resolveCoverFields(data, files, blogSlug, existing));

  const post = await prisma.$transaction(async (tx) => {
    if (updateData.featured) {
      await tx.blogPost.updateMany({
        where: { featured: true, id: { not: id } },
        data: { featured: false },
      });
    }

    await tx.blogPost.update({ where: { id }, data: updateData });
    return tx.blogPost.findUniqueOrThrow({ where: { id } });
  });

  return formatBlogDetail(post);
}

export async function uploadBlogCover(id: number, file: Express.Multer.File) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Blog post not found");

  if (existing.coverImageCloudinaryId) {
    await deleteCloudinaryAsset(existing.coverImageCloudinaryId, "image");
  }

  const upload = await uploadBlogCoverImage(file, existing.slug);
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      coverImage: upload.url,
      coverImageCloudinaryId: upload.publicId,
    },
  });

  return formatBlogDetail(post);
}

export async function removeBlogCover(id: number) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Blog post not found");

  if (existing.coverImageCloudinaryId) {
    await deleteCloudinaryAsset(existing.coverImageCloudinaryId, "image");
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      coverImage: null,
      coverImageCloudinaryId: null,
    },
  });

  return formatBlogDetail(post);
}

export async function deleteBlog(id: number) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Blog post not found");

  await deleteBlogAssets(existing);
  await prisma.blogPost.delete({ where: { id } });
}

export async function listBlogCategories() {
  const rows = await prisma.blogPost.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  return rows.map((row) => row.category);
}
