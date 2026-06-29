import sanitizeHtml from "sanitize-html";
import { prisma } from "../../config/prisma";
import { uniqueSlug } from "../../utils/slug";
import { AppError } from "../../utils/apiResponse";
import {
  deleteCloudinaryAsset,
  uploadJournalCoverImage,
  uploadJournalPdf,
  uploadJournalSectionImage,
} from "../../services/cloudinary.service";
import {
  formatJournalDate,
  formatJournalDetail,
  formatJournalListItem,
} from "./journals.formatter";
import type { JournalSectionDto, JournalUploadFiles, JournalWriteInput, ListJournalsParams } from "./journals.types";

function sanitizeText(value: string) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

function sanitizeSections(sections: JournalWriteInput["sections"]) {
  return sections.map((section) => ({
    heading: sanitizeText(section.heading),
    body: sanitizeText(section.body),
    ...(section.bullets?.length
      ? { bullets: section.bullets.map((bullet) => sanitizeText(bullet)) }
      : {}),
    ...(section.imageUrl ? { imageUrl: section.imageUrl } : {}),
    ...(section.imageCloudinaryId ? { imageCloudinaryId: section.imageCloudinaryId } : {}),
  }));
}

function sanitizeCallout(callout: JournalWriteInput["callout"]) {
  if (!callout) return null;
  return {
    label: sanitizeText(callout.label),
    body: sanitizeText(callout.body),
  };
}

function buildWhere(params: ListJournalsParams) {
  const where: Record<string, unknown> = {};
  if (params.publishedOnly !== false) where.published = true;
  if (params.field) where.field = params.field;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { abstract: { contains: params.search, mode: "insensitive" } },
      { doi: { contains: params.search, mode: "insensitive" } },
    ];
  }
  return where;
}

function filterByKeyword<T extends { keywords: unknown }>(items: T[], keyword?: string) {
  if (!keyword) return items;
  return items.filter((item) => {
    const keywords = Array.isArray(item.keywords) ? (item.keywords as string[]) : [];
    return keywords.some((k) => k.toLowerCase() === keyword.toLowerCase());
  });
}

async function findJournalRecord(idOrSlug: string, publishedOnly = true) {
  const isNumeric = /^\d+$/.test(idOrSlug);
  const where: Record<string, unknown> = publishedOnly ? { published: true } : {};

  if (isNumeric) {
    return prisma.journalEntry.findFirst({
      where: { ...where, id: Number(idOrSlug) },
    });
  }

  return prisma.journalEntry.findFirst({
    where: { ...where, slug: idOrSlug },
  });
}

async function resolveMediaFields(
  data: Partial<JournalWriteInput>,
  files: JournalUploadFiles | undefined,
  journalSlug: string,
  existing?: {
    coverImageCloudinaryId: string | null;
    pdfCloudinaryId: string | null;
    sections?: unknown;
  }
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
    const upload = await uploadJournalCoverImage(files.cover, journalSlug);
    result.coverImage = upload.url;
    result.coverImageCloudinaryId = upload.publicId;
  }

  if (data.removePdf) {
    if (existing?.pdfCloudinaryId) {
      await deleteCloudinaryAsset(existing.pdfCloudinaryId, "raw");
    }
    result.pdfUrl = null;
    result.pdfCloudinaryId = null;
  } else if (files?.pdf) {
    if (existing?.pdfCloudinaryId) {
      await deleteCloudinaryAsset(existing.pdfCloudinaryId, "raw");
    }
    const upload = await uploadJournalPdf(files.pdf, journalSlug);
    result.pdfUrl = upload.url;
    result.pdfCloudinaryId = upload.publicId;
  }

  // Handle section images
  if (data.sections) {
    const existingSections = (existing?.sections || []) as Array<{ imageUrl?: string | null, imageCloudinaryId?: string | null }>;
    const updatedSections = [...data.sections];

    for (let i = 0; i < updatedSections.length; i++) {
      const section = updatedSections[i];
      const file = files?.sectionImages?.[i];
      const existingSection = existingSections[i];

      if (section.removeImage) {
        if (existingSection?.imageCloudinaryId) {
          await deleteCloudinaryAsset(existingSection.imageCloudinaryId, "image");
        }
        delete section.imageUrl;
        delete section.imageCloudinaryId;
      } else if (file) {
        if (existingSection?.imageCloudinaryId) {
          await deleteCloudinaryAsset(existingSection.imageCloudinaryId, "image");
        }
        const upload = await uploadJournalSectionImage(file, journalSlug);
        section.imageUrl = upload.url;
        section.imageCloudinaryId = upload.publicId;
      } else if (existingSection?.imageUrl && !section.removeImage) {
        // Keep existing image
        section.imageUrl = existingSection.imageUrl;
        section.imageCloudinaryId = existingSection.imageCloudinaryId ?? undefined;
      }

      delete section.removeImage;
    }

    result.sections = updatedSections;
  }

  return result;
}

async function deleteJournalAssets(entry: {
  coverImageCloudinaryId: string | null;
  pdfCloudinaryId: string | null;
  sections?: unknown;
}) {
  const sectionImagesToDelete: (string | null | undefined)[] = [];
  const sections = (entry.sections || []) as Array<{ imageCloudinaryId?: string | null }>;
  
  for (const section of sections) {
    if (section.imageCloudinaryId) {
      sectionImagesToDelete.push(section.imageCloudinaryId);
    }
  }

  await Promise.all([
    deleteCloudinaryAsset(entry.coverImageCloudinaryId, "image"),
    deleteCloudinaryAsset(entry.pdfCloudinaryId, "raw"),
    ...sectionImagesToDelete.map(id => deleteCloudinaryAsset(id, "image")),
  ]);
}

function mapWriteInputToDb(data: JournalWriteInput, mediaFields: Record<string, unknown>) {
  const callout = sanitizeCallout(data.callout ?? null);
  // Use sections from mediaFields if available and it's an array, otherwise sanitize original
  let sectionsToSanitize = data.sections;
  if (Array.isArray(mediaFields.sections)) {
    sectionsToSanitize = mediaFields.sections as JournalSectionDto[];
  }

  return {
    title: data.title.trim(),
    abstract: sanitizeText(data.abstract),
    field: data.field.trim(),
    authors: data.authors,
    authorAffiliation: data.authorAffiliation?.trim() || null,
    volume: data.volume.trim(),
    year: data.year.trim(),
    doi: data.doi?.trim() || null,
    keywords: data.keywords,
    accentColor: data.accentColor ?? "#045d30",
    sections: sanitizeSections(sectionsToSanitize),
    ...(callout ? { callout } : {}),
    citeSuggestion: data.citeSuggestion?.trim() || null,
    featured: data.featured ?? false,
    isPopular: data.isPopular ?? false,
    published: data.published ?? true,
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    sortOrder: data.sortOrder ?? 0,
    // Don't spread all mediaFields because we already handled sections
    ...Object.fromEntries(
      Object.entries(mediaFields).filter(([key]) => key !== "sections")
    ),
  };
}

export async function listJournals(params: ListJournalsParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const where = buildWhere(params);

  const [items, total] = await Promise.all([
    prisma.journalEntry.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.journalEntry.count({ where }),
  ]);

  const filtered = filterByKeyword(items, params.keyword);

  return {
    items: filtered.map(formatJournalListItem),
    meta: {
      page,
      limit,
      total: params.keyword ? filtered.length : total,
      totalPages: Math.ceil((params.keyword ? filtered.length : total) / limit),
    },
  };
}

export async function getJournalByIdentifier(idOrSlug: string, publishedOnly = true) {
  const entry = await findJournalRecord(idOrSlug, publishedOnly);
  if (!entry) throw new AppError(404, "Journal entry not found");
  return formatJournalDetail(entry);
}

export async function getJournalById(id: number, publishedOnly = true) {
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, "Invalid journal id");
  }

  const entry = await prisma.journalEntry.findFirst({
    where: { id, ...(publishedOnly ? { published: true } : {}) },
  });

  if (!entry) throw new AppError(404, "Journal entry not found");
  return formatJournalDetail(entry);
}

export async function getFeaturedJournal() {
  const featured = await prisma.journalEntry.findFirst({
    where: { published: true, featured: true },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
  });

  if (featured) return formatJournalListItem(featured);

  const newest = await prisma.journalEntry.findFirst({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
  });

  if (!newest) throw new AppError(404, "No journal entries available");
  return formatJournalListItem(newest);
}

export async function getPopularJournals(limit = 4) {
  const popular = await prisma.journalEntry.findMany({
    where: { published: true, isPopular: true },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { id: "desc" }],
    take: limit,
  });

  if (popular.length > 0) return popular.map(formatJournalListItem);

  const fallback = await prisma.journalEntry.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: limit,
  });

  return fallback.map(formatJournalListItem);
}

export async function getRelatedJournals(excludeId: number, limit = 4) {
  const entries = await prisma.journalEntry.findMany({
    where: { published: true, id: { not: excludeId } },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: limit,
  });

  return entries.map((entry) => ({
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    field: entry.field,
    volume: entry.volume,
  }));
}

export async function incrementJournalViewCount(idOrSlug: string) {
  const entry = await findJournalRecord(idOrSlug, true);
  if (!entry) return;

  await prisma.journalEntry.update({
    where: { id: entry.id },
    data: { viewCount: { increment: 1 } },
  });
}

export async function listJournalFields() {
  const rows = await prisma.journalEntry.findMany({
    where: { published: true },
    select: { field: true },
    distinct: ["field"],
    orderBy: { field: "asc" },
  });

  return rows.map((row) => row.field);
}

export async function createJournal(data: JournalWriteInput, files?: JournalUploadFiles) {
  const slug =
    data.slug ||
    (await uniqueSlug(
      data.title,
      async (s) => !!(await prisma.journalEntry.findUnique({ where: { slug: s } }))
    ));

  const mediaFields = await resolveMediaFields(data, files, slug);
  const dbData = mapWriteInputToDb(data, mediaFields);

  const entry = await prisma.$transaction(async (tx) => {
    if (dbData.featured) {
      await tx.journalEntry.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
    }

    return tx.journalEntry.create({
      data: { ...dbData, slug },
    });
  });

  return formatJournalDetail(entry);
}

export async function updateJournal(
  id: number,
  data: Partial<JournalWriteInput>,
  files?: JournalUploadFiles
) {
  const existing = await prisma.journalEntry.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Journal entry not found");

  const journalSlug =
    data.slug ||
    (data.title
      ? await uniqueSlug(data.title, async (s) => {
          const found = await prisma.journalEntry.findUnique({ where: { slug: s } });
          return !!found && found.id !== id;
        })
      : existing.slug);

  const mediaFields = await resolveMediaFields(data, files, journalSlug, existing);

  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.abstract !== undefined) updateData.abstract = sanitizeText(data.abstract);
  if (data.field !== undefined) updateData.field = data.field.trim();
  if (data.authors !== undefined) updateData.authors = data.authors;
  if (data.authorAffiliation !== undefined) {
    updateData.authorAffiliation = data.authorAffiliation?.trim() || null;
  }
  if (data.volume !== undefined) updateData.volume = data.volume.trim();
  if (data.year !== undefined) updateData.year = data.year.trim();
  if (data.doi !== undefined) updateData.doi = data.doi?.trim() || null;
  if (data.keywords !== undefined) updateData.keywords = data.keywords;
  if (data.accentColor !== undefined) updateData.accentColor = data.accentColor;
  if (data.sections !== undefined) {
    // Use sections from mediaFields if available and it's an array, otherwise sanitize original sections
    let sectionsToSanitize = data.sections;
    if (Array.isArray(mediaFields.sections)) {
      sectionsToSanitize = mediaFields.sections as JournalSectionDto[];
    }
    updateData.sections = sanitizeSections(sectionsToSanitize);
  }
  if (data.callout !== undefined) updateData.callout = sanitizeCallout(data.callout ?? null);
  if (data.citeSuggestion !== undefined) {
    updateData.citeSuggestion = data.citeSuggestion?.trim() || null;
  }
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.isPopular !== undefined) updateData.isPopular = data.isPopular;
  if (data.published !== undefined) updateData.published = data.published;
  if (data.publishedAt !== undefined) updateData.publishedAt = new Date(data.publishedAt);
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

  if (data.slug) {
    updateData.slug = data.slug;
  } else if (data.title) {
    updateData.slug = journalSlug;
  }

  // Merge media fields without overwriting sections we already sanitized
  const { sections: _, ...restMediaFields } = mediaFields;
  Object.assign(updateData, restMediaFields);

  const entry = await prisma.$transaction(async (tx) => {
    if (updateData.featured) {
      await tx.journalEntry.updateMany({
        where: { featured: true, id: { not: id } },
        data: { featured: false },
      });
    }

    await tx.journalEntry.update({ where: { id }, data: updateData });
    return tx.journalEntry.findUniqueOrThrow({ where: { id } });
  });

  return formatJournalDetail(entry);
}

export async function uploadJournalCoverAttachment(id: number, file: Express.Multer.File) {
  const existing = await prisma.journalEntry.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Journal entry not found");

  if (existing.coverImageCloudinaryId) {
    await deleteCloudinaryAsset(existing.coverImageCloudinaryId, "image");
  }

  const upload = await uploadJournalCoverImage(file, existing.slug);
  const entry = await prisma.journalEntry.update({
    where: { id },
    data: {
      coverImage: upload.url,
      coverImageCloudinaryId: upload.publicId,
    },
  });

  return formatJournalDetail(entry);
}

export async function uploadJournalPdfAttachment(id: number, file: Express.Multer.File) {
  const existing = await prisma.journalEntry.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Journal entry not found");

  if (existing.pdfCloudinaryId) {
    await deleteCloudinaryAsset(existing.pdfCloudinaryId, "raw");
  }

  const upload = await uploadJournalPdf(file, existing.slug);
  const entry = await prisma.journalEntry.update({
    where: { id },
    data: {
      pdfUrl: upload.url,
      pdfCloudinaryId: upload.publicId,
    },
  });

  return formatJournalDetail(entry);
}

export async function removeJournalCoverAttachment(id: number) {
  const existing = await prisma.journalEntry.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Journal entry not found");

  if (existing.coverImageCloudinaryId) {
    await deleteCloudinaryAsset(existing.coverImageCloudinaryId, "image");
  }

  const entry = await prisma.journalEntry.update({
    where: { id },
    data: {
      coverImage: null,
      coverImageCloudinaryId: null,
    },
  });

  return formatJournalDetail(entry);
}

export async function removeJournalPdfAttachment(id: number) {
  const existing = await prisma.journalEntry.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Journal entry not found");

  if (existing.pdfCloudinaryId) {
    await deleteCloudinaryAsset(existing.pdfCloudinaryId, "raw");
  }

  const entry = await prisma.journalEntry.update({
    where: { id },
    data: {
      pdfUrl: null,
      pdfCloudinaryId: null,
    },
  });

  return formatJournalDetail(entry);
}

export async function deleteJournal(id: number) {
  const existing = await prisma.journalEntry.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Journal entry not found");

  await deleteJournalAssets(existing);
  await prisma.journalEntry.delete({ where: { id } });
}

export { formatJournalDate };
