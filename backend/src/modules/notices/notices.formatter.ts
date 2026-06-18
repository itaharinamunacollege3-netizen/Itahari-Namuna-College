import type { Notice } from "../../generated/prisma/client";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function formatNoticeForApi(notice: Notice) {
  const d = new Date(notice.publishedAt);
  return {
    id: notice.id,
    slug: notice.slug,
    title: notice.title,
    description: notice.summary ?? notice.content.slice(0, 200),
    content: notice.content,
    date: {
      day: String(d.getUTCDate()).padStart(2, "0"),
      month: MONTHS[d.getUTCMonth()],
    },
    publishedDate: notice.publishedAt.toISOString().slice(0, 10),
    author: notice.author,
    audience: notice.audience,
    tags: notice.tags as string[],
    category: notice.category,
    pdfUrl: notice.attachmentUrl,
    showInPopup: notice.showInPopup,
    showInMarquee: notice.showInMarquee,
    marqueeText: notice.marqueeText,
  };
}
