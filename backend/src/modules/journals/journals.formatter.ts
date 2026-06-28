import type { JournalEntry } from "../../generated/prisma/client";
import type {
  JournalCalloutDto,
  JournalDetailDto,
  JournalListItemDto,
  JournalSectionDto,
} from "./journals.types";

const DISPLAY_DATE = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export function formatJournalDate(publishedAt: Date): string {
  return DISPLAY_DATE.format(publishedAt);
}

function parseSections(value: unknown): JournalSectionDto[] {
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
    .filter(Boolean) as JournalSectionDto[];
}

function parseCallout(value: unknown): JournalCalloutDto | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const label = String(item.label ?? "").trim();
  const body = String(item.body ?? "").trim();
  if (!label || !body) return null;
  return { label, body };
}

function parseAuthors(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((a) => a.trim()).filter(Boolean) : [];
}

function parseKeywords(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((k) => k.trim()).filter(Boolean) : [];
}

export function formatJournalListItem(entry: JournalEntry): JournalListItemDto {
  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    abstract: entry.abstract,
    field: entry.field,
    authors: parseAuthors(entry.authors),
    volume: entry.volume,
    year: entry.year,
    date: formatJournalDate(entry.publishedAt),
    coverImage: entry.coverImage ?? "",
    accentColor: entry.accentColor,
    featured: entry.featured,
    isPopular: entry.isPopular,
    published: entry.published,
    publishedAt: entry.publishedAt.toISOString(),
    sortOrder: entry.sortOrder,
    pdfUrl: entry.pdfUrl ?? "",
  };
}

export function formatJournalDetail(entry: JournalEntry): JournalDetailDto {
  return {
    ...formatJournalListItem(entry),
    authorAffiliation: entry.authorAffiliation,
    doi: entry.doi,
    keywords: parseKeywords(entry.keywords),
    sections: parseSections(entry.sections),
    callout: parseCallout(entry.callout),
    citeSuggestion: entry.citeSuggestion,
  };
}
