import sanitizeHtml from "sanitize-html";
import { prisma } from "../../config/prisma";
import { uniqueSlug } from "../../utils/slug";
import { AppError } from "../../utils/apiResponse";
import { formatNoticeForApi } from "./notices.formatter";
import type { ListNoticesParams, NoticeWriteInput } from "./notices.types";

const BS_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function sanitizeContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt"],
      a: ["href", "target", "rel"],
    },
  });
}

function assertPublishedDate(value: string) {
  if (!BS_DATE_PATTERN.test(value)) {
    throw new AppError(400, "publishedDate must use YYYY-MM-DD format");
  }
}

function buildPublishedWhere(params: ListNoticesParams) {
  const where: Record<string, unknown> = {};
  if (params.publishedOnly !== false) where.published = true;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { content: { contains: params.search, mode: "insensitive" } },
      { author: { contains: params.search, mode: "insensitive" } },
    ];
  }
  return where;
}

function filterByTag<T extends { tags: unknown }>(items: T[], tag?: string) {
  if (!tag) return items;
  return items.filter((item) => {
    const tags = Array.isArray(item.tags) ? (item.tags as string[]) : [];
    return tags.includes(tag);
  });
}

/** Ensures at most one notice is featured at any time. */
async function clearOtherFeatured(
  tx: Pick<typeof prisma, "notice">,
  noticeId: number
) {
  await tx.notice.updateMany({
    where: { featured: true, id: { not: noticeId } },
    data: { featured: false, showInPopup: false },
  });
}

function mapWriteInputToDb(data: NoticeWriteInput) {
  assertPublishedDate(data.publishedDate);

  return {
    title: data.title.trim(),
    content: sanitizeContent(data.description),
    publishedDate: data.publishedDate,
    category: data.category,
    tags: data.tags,
    audience: data.audience?.trim() || null,
    author: data.author?.trim() || null,
    attachmentUrl: data.pdfUrl?.trim() || null,
    attachmentType: data.pdfUrl?.trim() ? "pdf" : null,
    published: data.published ?? true,
    featured: data.featured ?? false,
    showInPopup: data.featured ?? false,
    publishedAt: new Date(),
  };
}

export async function listNotices(params: ListNoticesParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const where = buildPublishedWhere(params);

  const [items, total] = await Promise.all([
    prisma.notice.findMany({
      where,
      orderBy: [{ publishedDate: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notice.count({ where }),
  ]);

  const filtered = filterByTag(items, params.tag);

  return {
    items: filtered.map(formatNoticeForApi),
    meta: {
      page,
      limit,
      total: params.tag ? filtered.length : total,
      totalPages: Math.ceil((params.tag ? filtered.length : total) / limit),
    },
  };
}

export async function getNoticeById(id: number, publishedOnly = true) {
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, "Invalid notice id");
  }

  const notice = await prisma.notice.findFirst({
    where: { id, ...(publishedOnly ? { published: true } : {}) },
  });

  if (!notice) throw new AppError(404, "Notice not found");
  return formatNoticeForApi(notice);
}

export async function getFeaturedNotice() {
  const featured = await prisma.notice.findFirst({
    where: { published: true, featured: true },
    orderBy: [{ publishedDate: "desc" }, { id: "desc" }],
  });

  if (featured) return formatNoticeForApi(featured);

  const newest = await prisma.notice.findFirst({
    where: { published: true },
    orderBy: [{ publishedDate: "desc" }, { id: "desc" }],
  });

  if (!newest) throw new AppError(404, "No notices available");
  return formatNoticeForApi(newest);
}

export async function createNotice(data: NoticeWriteInput) {
  const slug =
    data.slug ||
    (await uniqueSlug(data.title, async (s) => !!(await prisma.notice.findUnique({ where: { slug: s } }))));

  const dbData = mapWriteInputToDb(data);

  const notice = await prisma.$transaction(async (tx) => {
    const created = await tx.notice.create({
      data: { ...dbData, slug },
    });

    if (created.featured) {
      await clearOtherFeatured(tx, created.id);
    }

    return created;
  });

  return formatNoticeForApi(notice);
}

export async function updateNotice(id: number, data: Partial<NoticeWriteInput>) {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Notice not found");

  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined) updateData.content = sanitizeContent(data.description);
  if (data.publishedDate !== undefined) {
    assertPublishedDate(data.publishedDate);
    updateData.publishedDate = data.publishedDate;
  }
  if (data.category !== undefined) updateData.category = data.category;
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.audience !== undefined) updateData.audience = data.audience?.trim() || null;
  if (data.author !== undefined) updateData.author = data.author?.trim() || null;
  if (data.pdfUrl !== undefined) {
    updateData.attachmentUrl = data.pdfUrl?.trim() || null;
    updateData.attachmentType = data.pdfUrl?.trim() ? "pdf" : null;
  }
  if (data.published !== undefined) updateData.published = data.published;
  if (data.featured !== undefined) {
    updateData.featured = data.featured;
    updateData.showInPopup = data.featured;
  }

  if (data.title && !data.slug) {
    updateData.slug = await uniqueSlug(data.title, async (s) => {
      const found = await prisma.notice.findUnique({ where: { slug: s } });
      return !!found && found.id !== id;
    });
  } else if (data.slug) {
    updateData.slug = data.slug;
  }

  const notice = await prisma.$transaction(async (tx) => {
    const updated = await tx.notice.update({ where: { id }, data: updateData });

    if (data.featured === true) {
      await clearOtherFeatured(tx, updated.id);
    }

    return tx.notice.findUniqueOrThrow({ where: { id } });
  });

  return formatNoticeForApi(notice);
}

export async function deleteNotice(id: number) {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Notice not found");
  await prisma.notice.delete({ where: { id } });
}
