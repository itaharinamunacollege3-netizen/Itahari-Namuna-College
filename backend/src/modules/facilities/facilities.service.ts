import sanitizeHtml from "sanitize-html";
import { prisma } from "../../config/prisma";
import { uniqueSlug } from "../../utils/slug";
import { AppError } from "../../utils/apiResponse";
import { deleteCloudinaryAsset, uploadFacilityImage } from "../../services/cloudinary.service";
import { formatFacilityDetail, formatFacilityListItem } from "./facilities.formatter";
import type { FacilityUploadFiles, FacilityWriteInput, ListFacilitiesParams } from "./facilities.types";

function sanitizeText(value: string) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

function buildWhere(params: ListFacilitiesParams) {
  const where: Record<string, unknown> = {};
  if (params.publishedOnly !== false) where.published = true;
  if (params.category) where.category = params.category;
  return where;
}

async function findFacilityRecord(idOrSlug: string, publishedOnly = true) {
  const isNumeric = /^\d+$/.test(idOrSlug);
  const where: Record<string, unknown> = publishedOnly ? { published: true } : {};

  if (isNumeric) {
    return prisma.facility.findFirst({
      where: { ...where, id: Number(idOrSlug) },
    });
  }

  return prisma.facility.findFirst({
    where: { ...where, slug: idOrSlug },
  });
}

async function resolveMediaFields(
  data: Partial<FacilityWriteInput>,
  files: FacilityUploadFiles | undefined,
  facilitySlug: string,
  existing?: { imageUrl: string | null; imageCloudinaryId: string | null }
) {
  const result: Record<string, unknown> = {};

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
    const upload = await uploadFacilityImage(files.image, facilitySlug);
    result.imageUrl = upload.url;
    result.imageCloudinaryId = upload.publicId;
  }

  return result;
}

function mapWriteInputToDb(data: FacilityWriteInput, mediaFields: Record<string, unknown>) {
  return {
    index: data.index.trim(),
    category: data.category.trim(),
    title: data.title.trim(),
    tagline: sanitizeText(data.tagline),
    descriptionPart1: sanitizeText(data.descriptionPart1),
    descriptionPart2: sanitizeText(data.descriptionPart2),
    specs: data.specs.map((spec) => sanitizeText(spec)),
    featured: data.featured ?? false,
    published: data.published ?? true,
    sortOrder: data.sortOrder ?? 0,
    ...mediaFields,
  };
}

export async function listFacilities(params: ListFacilitiesParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const where = buildWhere(params);

  const [items, total] = await Promise.all([
    prisma.facility.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.facility.count({ where }),
  ]);

  return {
    items: items.map(formatFacilityListItem),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getFacilityByIdentifier(idOrSlug: string, publishedOnly = true) {
  const facility = await findFacilityRecord(idOrSlug, publishedOnly);
  if (!facility) throw new AppError(404, "Facility not found");
  return formatFacilityDetail(facility);
}

export async function getFacilityById(id: number, publishedOnly = true) {
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, "Invalid facility id");
  }

  const facility = await prisma.facility.findFirst({
    where: { id, ...(publishedOnly ? { published: true } : {}) },
  });

  if (!facility) throw new AppError(404, "Facility not found");
  return formatFacilityDetail(facility);
}

export async function getFeaturedFacility() {
  const featured = await prisma.facility.findFirst({
    where: { published: true, featured: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }, { id: "desc" }],
  });

  if (featured) return formatFacilityListItem(featured);

  const newest = await prisma.facility.findFirst({
    where: { published: true },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  if (!newest) throw new AppError(404, "No facilities available");
  return formatFacilityListItem(newest);
}

export async function listFacilityCategories() {
  const rows = await prisma.facility.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  return rows.map((row) => row.category);
}

export async function createFacility(data: FacilityWriteInput, files?: FacilityUploadFiles) {
  const slug =
    data.slug ||
    (await uniqueSlug(data.title, async (s) => !!(await prisma.facility.findUnique({ where: { slug: s } }))));

  const mediaFields = await resolveMediaFields(data, files, slug);
  const dbData = mapWriteInputToDb(data, mediaFields);

  const facility = await prisma.$transaction(async (tx) => {
    if (dbData.featured) {
      await tx.facility.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
    }

    return tx.facility.create({
      data: { ...dbData, slug },
    });
  });

  return formatFacilityDetail(facility);
}

export async function updateFacility(
  id: number,
  data: Partial<FacilityWriteInput>,
  files?: FacilityUploadFiles
) {
  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Facility not found");

  const facilitySlug =
    data.slug ||
    (data.title
      ? await uniqueSlug(data.title, async (s) => {
          const found = await prisma.facility.findUnique({ where: { slug: s } });
          return !!found && found.id !== id;
        })
      : existing.slug);

  const mediaFields = await resolveMediaFields(data, files, facilitySlug, existing);

  const updateData: Record<string, unknown> = {};

  if (data.index !== undefined) updateData.index = data.index.trim();
  if (data.category !== undefined) updateData.category = data.category.trim();
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.tagline !== undefined) updateData.tagline = sanitizeText(data.tagline);
  if (data.descriptionPart1 !== undefined) updateData.descriptionPart1 = sanitizeText(data.descriptionPart1);
  if (data.descriptionPart2 !== undefined) updateData.descriptionPart2 = sanitizeText(data.descriptionPart2);
  if (data.specs !== undefined) updateData.specs = data.specs.map((spec) => sanitizeText(spec));
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.published !== undefined) updateData.published = data.published;
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

  if (data.slug) {
    updateData.slug = data.slug;
  } else if (data.title) {
    updateData.slug = facilitySlug;
  }

  Object.assign(updateData, mediaFields);

  const facility = await prisma.$transaction(async (tx) => {
    if (updateData.featured) {
      await tx.facility.updateMany({
        where: { featured: true, id: { not: id } },
        data: { featured: false },
      });
    }

    await tx.facility.update({ where: { id }, data: updateData });
    return tx.facility.findUniqueOrThrow({ where: { id } });
  });

  return formatFacilityDetail(facility);
}

export async function uploadFacilityCover(id: number, file: Express.Multer.File) {
  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Facility not found");

  if (existing.imageCloudinaryId) {
    await deleteCloudinaryAsset(existing.imageCloudinaryId, "image");
  }

  const upload = await uploadFacilityImage(file, existing.slug);
  const facility = await prisma.facility.update({
    where: { id },
    data: {
      imageUrl: upload.url,
      imageCloudinaryId: upload.publicId,
    },
  });

  return formatFacilityDetail(facility);
}

export async function removeFacilityCover(id: number) {
  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Facility not found");

  if (existing.imageCloudinaryId) {
    await deleteCloudinaryAsset(existing.imageCloudinaryId, "image");
  }

  const facility = await prisma.facility.update({
    where: { id },
    data: {
      imageUrl: null,
      imageCloudinaryId: null,
    },
  });

  return formatFacilityDetail(facility);
}

export async function deleteFacility(id: number) {
  const existing = await prisma.facility.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Facility not found");

  if (existing.imageCloudinaryId) {
    await deleteCloudinaryAsset(existing.imageCloudinaryId, "image");
  }

  await prisma.facility.delete({ where: { id } });
}
