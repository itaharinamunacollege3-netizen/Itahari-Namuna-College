import sanitizeHtml from "sanitize-html";
import { prisma } from "../../config/prisma";
import { uniqueSlug } from "../../utils/slug";
import { AppError } from "../../utils/apiResponse";
import {
  deleteCloudinaryAsset,
  uploadNoticeImage,
  uploadNoticePdf,
} from "../../services/cloudinary.service";
import { formatNoticeForApi } from "./notices.formatter";
import type { ListNoticesParams, NoticeUploadFiles, NoticeWriteInput } from "./notices.types";

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



async function deleteNoticeAssets(notice: {
  attachmentCloudinaryId: string | null;
  imageCloudinaryId: string | null;
}) {
  await Promise.all([
    deleteCloudinaryAsset(notice.attachmentCloudinaryId, "raw"),
    deleteCloudinaryAsset(notice.imageCloudinaryId, "image"),
  ]);
}

async function resolveAttachmentFields(
  data: Partial<NoticeWriteInput>,
  files: NoticeUploadFiles | undefined,
  noticeSlug: string,
  existing?: {
    attachmentUrl: string | null;
    attachmentType: string | null;
    attachmentCloudinaryId: string | null;
    imageUrl: string | null;
    imageCloudinaryId: string | null;
  }
) {
  const result: Record<string, unknown> = {};

  if (data.removePdf) {
    if (existing?.attachmentCloudinaryId) {
      await deleteCloudinaryAsset(existing.attachmentCloudinaryId, "raw");
    }
    result.attachmentUrl = null;
    result.attachmentType = null;
    result.attachmentCloudinaryId = null;
  } else if (files?.pdf) {
    if (existing?.attachmentCloudinaryId) {
      await deleteCloudinaryAsset(existing.attachmentCloudinaryId, "raw");
    }
    const upload = await uploadNoticePdf(files.pdf, noticeSlug);
    result.attachmentUrl = upload.url;
    result.attachmentType = "pdf";
    result.attachmentCloudinaryId = upload.publicId;
  } else if (data.pdfUrl !== undefined) {
    const pdfUrl = data.pdfUrl?.trim() || null;
    if (pdfUrl && existing?.attachmentCloudinaryId) {
      await deleteCloudinaryAsset(existing.attachmentCloudinaryId, "raw");
      result.attachmentCloudinaryId = null;
    }
    result.attachmentUrl = pdfUrl;
    result.attachmentType = pdfUrl ? "pdf" : null;
    if (!pdfUrl) result.attachmentCloudinaryId = null;
  }

  if (data.removeImage) {
    if (existing?.imageCloudinaryId) {
      await deleteCloudinaryAsset(existing.imageCloudinaryId, "image");
    }
    result.imageUrl = null;
    result.imageCloudinaryId = null;
  } else if (files?.image) {
    if (existing?.imageCloudinaryId) {
      await deleteCloudinaryAsset(existing.imageCloudinaryId, "image");
    }
    const upload = await uploadNoticeImage(files.image, noticeSlug);
    result.imageUrl = upload.url;
    result.imageCloudinaryId = upload.publicId;
  }

  return result;
}

function mapWriteInputToDb(data: NoticeWriteInput, attachmentFields: Record<string, unknown>) {
  assertPublishedDate(data.publishedDate);

  return {
    title: data.title.trim(),
    content: sanitizeContent(data.description),
    publishedDate: data.publishedDate,
    category: data.category,
    tags: data.tags,
    audience: data.audience?.trim() || null,
    author: data.author?.trim() || null,
    published: data.published ?? true,
    featured: data.featured ?? false,
    showInPopup: data.featured ?? false,
    publishedAt: new Date(),
    ...attachmentFields,
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

export async function getFeaturedNotices() {
  const featured = await prisma.notice.findMany({
    where: { published: true, featured: true },
    orderBy: [{ publishedDate: "desc" }, { id: "desc" }],
  });

  if (featured.length > 0) return featured.map(formatNoticeForApi);

  const newest = await prisma.notice.findFirst({
    where: { published: true },
    orderBy: [{ publishedDate: "desc" }, { id: "desc" }],
  });

  if (!newest) throw new AppError(404, "No notices available");
  return [formatNoticeForApi(newest)];
}

export async function createNotice(data: NoticeWriteInput, files?: NoticeUploadFiles) {
  const slug =
    data.slug ||
    (await uniqueSlug(data.title, async (s) => !!(await prisma.notice.findUnique({ where: { slug: s } }))));

  const attachmentFields = await resolveAttachmentFields(data, files, slug);
  const dbData = mapWriteInputToDb(data, attachmentFields);

  const notice = await prisma.$transaction(async (tx) => {
    if (dbData.featured) {
      await tx.notice.updateMany({
        where: { featured: true },
        data: { featured: false, showInPopup: false },
      });
    }

    const created = await tx.notice.create({
      data: { ...dbData, slug },
    });

    return created;
  });

  return formatNoticeForApi(notice);
}

export async function updateNotice(
  id: number,
  data: Partial<NoticeWriteInput>,
  files?: NoticeUploadFiles
) {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Notice not found");

  const noticeSlug =
    data.slug ||
    (data.title
      ? await uniqueSlug(data.title, async (s) => {
          const found = await prisma.notice.findUnique({ where: { slug: s } });
          return !!found && found.id !== id;
        })
      : existing.slug);

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
  if (data.published !== undefined) updateData.published = data.published;
  if (data.featured !== undefined) {
    updateData.featured = data.featured;
    updateData.showInPopup = data.featured;
  }

  if (data.slug) {
    updateData.slug = data.slug;
  } else if (data.title) {
    updateData.slug = noticeSlug;
  }

  Object.assign(
    updateData,
    await resolveAttachmentFields(data, files, noticeSlug, existing)
  );

  const notice = await prisma.$transaction(async (tx) => {
    if (updateData.featured) {
      await tx.notice.updateMany({
        where: { featured: true, id: { not: id } },
        data: { featured: false, showInPopup: false },
      });
    }

    const updated = await tx.notice.update({ where: { id }, data: updateData });

    return tx.notice.findUniqueOrThrow({ where: { id } });
  });

  return formatNoticeForApi(notice);
}

export async function uploadNoticePdfAttachment(id: number, file: Express.Multer.File) {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Notice not found");

  if (existing.attachmentCloudinaryId) {
    await deleteCloudinaryAsset(existing.attachmentCloudinaryId, "raw");
  }

  const upload = await uploadNoticePdf(file, existing.slug);
  const notice = await prisma.notice.update({
    where: { id },
    data: {
      attachmentUrl: upload.url,
      attachmentType: "pdf",
      attachmentCloudinaryId: upload.publicId,
    },
  });

  return formatNoticeForApi(notice);
}

export async function uploadNoticeImageAttachment(id: number, file: Express.Multer.File) {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Notice not found");

  if (existing.imageCloudinaryId) {
    await deleteCloudinaryAsset(existing.imageCloudinaryId, "image");
  }

  const upload = await uploadNoticeImage(file, existing.slug);
  const notice = await prisma.notice.update({
    where: { id },
    data: {
      imageUrl: upload.url,
      imageCloudinaryId: upload.publicId,
    },
  });

  return formatNoticeForApi(notice);
}

export async function removeNoticePdfAttachment(id: number) {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Notice not found");

  if (existing.attachmentCloudinaryId) {
    await deleteCloudinaryAsset(existing.attachmentCloudinaryId, "raw");
  }

  const notice = await prisma.notice.update({
    where: { id },
    data: {
      attachmentUrl: null,
      attachmentType: null,
      attachmentCloudinaryId: null,
    },
  });

  return formatNoticeForApi(notice);
}

export async function removeNoticeImageAttachment(id: number) {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Notice not found");

  if (existing.imageCloudinaryId) {
    await deleteCloudinaryAsset(existing.imageCloudinaryId, "image");
  }

  const notice = await prisma.notice.update({
    where: { id },
    data: {
      imageUrl: null,
      imageCloudinaryId: null,
    },
  });

  return formatNoticeForApi(notice);
}

export async function deleteNotice(id: number) {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Notice not found");

  await deleteNoticeAssets(existing);
  await prisma.notice.delete({ where: { id } });
}
