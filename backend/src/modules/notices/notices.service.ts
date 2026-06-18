import sanitizeHtml from "sanitize-html";
import { prisma } from "../../config/prisma";
import { uniqueSlug } from "../../utils/slug";
import { AppError } from "../../utils/apiResponse";
import { formatNoticeForApi } from "./notices.formatter";

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

export async function listNotices(params: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  tag?: string;
  publishedOnly?: boolean;
}) {
  const { page, limit, search, category, tag, publishedOnly = true } = params;
  const where: Record<string, unknown> = {};

  if (publishedOnly) where.published = true;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { summary: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.notice.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notice.count({ where }),
  ]);

  let filtered = items;
  if (tag) {
    filtered = items.filter((n) => (n.tags as string[]).includes(tag));
  }

  return {
    items: filtered.map(formatNoticeForApi),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getNoticeBySlug(slug: string, publishedOnly = true) {
  const notice = await prisma.notice.findFirst({
    where: { slug, ...(publishedOnly ? { published: true } : {}) },
  });
  if (!notice) throw new AppError(404, "Notice not found");
  return formatNoticeForApi(notice);
}

export async function getLatestNotices(options: { popup?: boolean; marquee?: boolean }) {
  const where: Record<string, unknown> = { published: true };
  if (options.popup) where.showInPopup = true;
  if (options.marquee) where.showInMarquee = true;

  const notices = await prisma.notice.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: options.marquee ? 10 : 1,
  });

  return notices.map(formatNoticeForApi);
}

export async function createNotice(data: {
  title: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  audience?: string;
  author?: string;
  attachmentUrl?: string;
  attachmentType?: string;
  published: boolean;
  showInPopup: boolean;
  showInMarquee: boolean;
  marqueeText?: string;
  publishedAt?: Date;
  slug?: string;
}) {
  const slug =
    data.slug ||
    (await uniqueSlug(data.title, async (s) => !!(await prisma.notice.findUnique({ where: { slug: s } }))));

  const notice = await prisma.notice.create({
    data: {
      ...data,
      slug,
      content: sanitizeContent(data.content),
      summary: data.summary ? sanitizeContent(data.summary) : undefined,
      publishedAt: data.publishedAt ?? new Date(),
      attachmentUrl: data.attachmentUrl || null,
      attachmentType: data.attachmentType || null,
    },
  });

  return formatNoticeForApi(notice);
}

export async function updateNotice(id: number, data: Partial<Parameters<typeof createNotice>[0]>) {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Notice not found");

  const updateData: Record<string, unknown> = { ...data };
  if (data.content) updateData.content = sanitizeContent(data.content);
  if (data.summary) updateData.summary = sanitizeContent(data.summary);
  if (data.title && !data.slug) {
    updateData.slug = await uniqueSlug(data.title, async (s) => {
      const found = await prisma.notice.findUnique({ where: { slug: s } });
      return !!found && found.id !== id;
    });
  }

  const notice = await prisma.notice.update({ where: { id }, data: updateData });
  return formatNoticeForApi(notice);
}

export async function deleteNotice(id: number) {
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Notice not found");
  await prisma.notice.delete({ where: { id } });
}
