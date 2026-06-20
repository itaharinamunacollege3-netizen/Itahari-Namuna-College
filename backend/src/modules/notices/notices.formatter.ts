import type { Notice } from "../../generated/prisma/client";
import type { NoticeApiDto } from "./notices.types";

export function formatNoticeForApi(notice: Notice): NoticeApiDto {
  return {
    id: notice.id,
    title: notice.title,
    description: notice.content,
    publishedDate: notice.publishedDate,
    category: notice.category,
    slug: notice.slug,
    author: notice.author,
    audience: notice.audience,
    tags: Array.isArray(notice.tags) ? (notice.tags as string[]) : [],
    featured: notice.featured,
    published: notice.published,
    pdfUrl: notice.attachmentType === "pdf" ? (notice.attachmentUrl ?? "") : "",
    imageUrl: notice.imageUrl ?? "",
  };
}
