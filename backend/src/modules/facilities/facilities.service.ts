import sanitizeHtml from "sanitize-html";
import { prisma } from "../../config/prisma";
import { slugify } from "../../utils/slug";
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
  if (params.categoryId) where.categoryId = params.categoryId;
  return where;
}

async function findFacilityRecord(idOrSlug: string, publishedOnly = true) {
  const isNumeric = /^\d+$/.test(idOrSlug);
  const where: Record<string, unknown> = publishedOnly ? { published: true } : {};

  if (isNumeric) {
    return prisma.facility.findFirst({
      where: { ...where, id: Number(idOrSlug) },
      include: { category: true },
    });
  }

  return prisma.facility.findFirst({
    where: { ...where, slug: idOrSlug },
    include: { category: true },
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
    categoryId: data.categoryId,
    title: data.title.trim(),
    tagline: sanitizeText(data.tagline),
    descriptions: data.descriptions.map((desc) => sanitizeText(desc)),
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
      include: { category: true },
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
    include: { category: true },
  });

  if (!facility) throw new AppError(404, "Facility not found");
  return formatFacilityDetail(facility);
}

export async function getFeaturedFacility() {
  const featured = await prisma.facility.findFirst({
    where: { published: true, featured: true },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }, { id: "desc" }],
  });

  if (featured) return formatFacilityListItem(featured);

  const newest = await prisma.facility.findFirst({
    where: { published: true },
    include: { category: true },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  if (!newest) throw new AppError(404, "No facilities available");
  return formatFacilityListItem(newest);
}

export async function listFacilityCategories() {
  return prisma.facilityCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function listAllFacilityCategories() {
  return prisma.facilityCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { facilities: true } } },
  });
}

export async function getFacilityCategory(id: number) {
  const category = await prisma.facilityCategory.findUnique({
    where: { id },
    include: { _count: { select: { facilities: true } } },
  });
  if (!category) throw new AppError(404, "Facility category not found");
  return category;
}

export async function createFacilityCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}) {
  const slug = data.slug || slugify(data.name);

  const existing = await prisma.facilityCategory.findUnique({ where: { slug } });
  if (existing) throw new AppError(409, `Category with slug "${slug}" already exists`);

  return prisma.facilityCategory.create({
    data: {
      name: data.name,
      slug,
      description: data.description ?? null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    },
  });
}

export async function updateFacilityCategory(
  id: number,
  data: Partial<{
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  const existing = await prisma.facilityCategory.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Facility category not found");

  if (data.slug && data.slug !== existing.slug) {
    const conflict = await prisma.facilityCategory.findUnique({ where: { slug: data.slug } });
    if (conflict) throw new AppError(409, `Category with slug "${data.slug}" already exists`);
  }

  return prisma.facilityCategory.update({
    where: { id },
    data: {
      ...data,
      description: data.description === undefined ? undefined : data.description ?? null,
    },
  });
}

export async function deleteFacilityCategory(id: number) {
  const existing = await prisma.facilityCategory.findUnique({
    where: { id },
    include: { _count: { select: { facilities: true } } },
  });
  if (!existing) throw new AppError(404, "Facility category not found");
  if (existing._count.facilities > 0) {
    throw new AppError(
      409,
      `Cannot delete category "${existing.name}" — ${existing._count.facilities} facility(-ies) assigned to it. Reassign or delete them first.`
    );
  }
  await prisma.facilityCategory.delete({ where: { id } });
}

export async function createFacility(data: FacilityWriteInput, files?: FacilityUploadFiles) {
  const slug =
    data.slug ||
    (await slugify(data.title));

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
      include: { category: true },
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
      ? await slugify(data.title)
      : existing.slug);

  const mediaFields = await resolveMediaFields(data, files, facilitySlug, existing);

  const updateData: Record<string, unknown> = {};

  if (data.index !== undefined) updateData.index = data.index.trim();
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.tagline !== undefined) updateData.tagline = sanitizeText(data.tagline);
  if (data.descriptions !== undefined) updateData.descriptions = data.descriptions.map((desc) => sanitizeText(desc));
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
    return tx.facility.findUniqueOrThrow({
      where: { id },
      include: { category: true },
    });
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
    include: { category: true },
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
    include: { category: true },
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
