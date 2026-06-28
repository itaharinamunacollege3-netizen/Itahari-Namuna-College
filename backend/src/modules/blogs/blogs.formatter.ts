import type { BlogPost } from "../../generated/prisma/client";
import type { BlogCalloutDto, BlogDetailDto, BlogListItemDto, BlogSectionDto } from "./blogs.types";

const DISPLAY_DATE = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function formatBlogDate(publishedAt: Date): string {
  return DISPLAY_DATE.format(publishedAt);
}

function parseSections(value: unknown): BlogSectionDto[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((section) => {
      if (typeof section !== "object" || section === null) return null;
      const item = section as Record<string, unknown>;
      const heading = String(item.heading ?? "").trim();
      const body = String(item.body ?? "").trim();
      if (!heading || !body) return null;
      const bullets = Array.isArray(item.bullets)
        ? item.bullets.map(String).map((b) => b.trim()).filter(Boolean)
        : undefined;
      return bullets?.length ? { heading, body, bullets } : { heading, body };
    })
    .filter(Boolean) as BlogSectionDto[];
}

function parseCallout(value: unknown): BlogCalloutDto | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const heading = String(item.heading ?? "").trim();
  const body = String(item.body ?? "").trim();
  if (!heading || !body) return null;
  return { heading, body };
}

function parseTags(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((t) => t.trim()).filter(Boolean) : [];
}

export function formatBlogListItem(post: BlogPost): BlogListItemDto {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    author: post.author,
    date: formatBlogDate(post.publishedAt),
    readTime: post.readTime,
    coverImage: post.coverImage ?? "",
    accentColor: post.accentColor,
    featured: post.featured,
    isPopular: post.isPopular,
    published: post.published,
    publishedAt: post.publishedAt.toISOString(),
    sortOrder: post.sortOrder,
    tags: parseTags(post.tags),
  };
}

export function formatBlogDetail(post: BlogPost): BlogDetailDto {
  return {
    ...formatBlogListItem(post),
    authorRole: post.authorRole,
    intro: post.intro,
    sections: parseSections(post.sections),
    callout: parseCallout(post.callout),
  };
}
