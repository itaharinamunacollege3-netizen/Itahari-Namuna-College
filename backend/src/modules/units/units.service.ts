import sanitizeHtml from "sanitize-html";
import { prisma } from "../../config/prisma";
import { slugify } from "../../utils/slug";
import { AppError } from "../../utils/apiResponse";
import { deleteCloudinaryAsset, uploadUnitIcon } from "../../services/cloudinary.service";
import { formatUnitDetail, formatUnitListItem } from "./units.formatter";
import type { UnitUploadFiles, UnitWriteInput, ListUnitsParams } from "./units.types";

function sanitizeText(value: string) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

function buildWhere(params: ListUnitsParams) {
  const where: Record<string, unknown> = {};
  if (params.publishedOnly !== false) where.published = true;
  if (params.categoryId) where.categoryId = params.categoryId;
  return where;
}

async function findUnitRecord(idOrSlug: string, publishedOnly = true) {
  const isNumeric = /^\d+$/.test(idOrSlug);
  const where: Record<string, unknown> = publishedOnly ? { published: true } : {};

  if (isNumeric) {
    return prisma.unit.findFirst({
      where: { ...where, id: Number(idOrSlug) },
      include: { category: true },
    });
  }

  return prisma.unit.findFirst({
    where: { ...where, slug: idOrSlug },
    include: { category: true },
  });
}

async function resolveMediaFields(
  data: Partial<UnitWriteInput>,
  files: UnitUploadFiles | undefined,
  unitSlug: string,
  existing?: { iconUrl: string | null; iconCloudinaryId: string | null }
) {
  const result: Record<string, unknown> = {};

  if (data.removeIcon) {
    if (existing?.iconCloudinaryId) {
      await deleteCloudinaryAsset(existing.iconCloudinaryId, "image");
    }
    result.iconUrl = null;
    result.iconCloudinaryId = null;
  } else if (files?.icon) {
    if (existing?.iconCloudinaryId) {
      await deleteCloudinaryAsset(existing.iconCloudinaryId, "image");
    }
    const upload = await uploadUnitIcon(files.icon, unitSlug);
    result.iconUrl = upload.url;
    result.iconCloudinaryId = upload.publicId;
  }

  return result;
}

function mapWriteInputToDb(data: UnitWriteInput, mediaFields: Record<string, unknown>) {
  return {
    code: data.code.trim(),
    categoryId: data.categoryId,
    title: data.title.trim(),
    objectives: data.objectives.map((obj) => sanitizeText(obj)),
    duties: data.duties.map((duty) => sanitizeText(duty)),
    actionPlan: data.actionPlan.map((ap) => ({
      sn: ap.sn,
      activity: sanitizeText(ap.activity),
      byWhen: sanitizeText(ap.byWhen),
      byWho: sanitizeText(ap.byWho),
      budget: sanitizeText(ap.budget),
    })),
    featured: data.featured ?? false,
    published: data.published ?? true,
    sortOrder: data.sortOrder ?? 0,
    ...mediaFields,
  };
}

export async function listUnits(params: ListUnitsParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const where = buildWhere(params);

  const [items, total] = await Promise.all([
    prisma.unit.findMany({
      where,
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.unit.count({ where }),
  ]);

  return {
    items: items.map(formatUnitListItem),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUnitByIdentifier(idOrSlug: string, publishedOnly = true) {
  const unit = await findUnitRecord(idOrSlug, publishedOnly);
  if (!unit) throw new AppError(404, "Unit not found");
  return formatUnitDetail(unit);
}

export async function getUnitById(id: number, publishedOnly = true) {
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, "Invalid unit id");
  }

  const unit = await prisma.unit.findFirst({
    where: { id, ...(publishedOnly ? { published: true } : {}) },
    include: { category: true },
  });

  if (!unit) throw new AppError(404, "Unit not found");
  return formatUnitDetail(unit);
}

export async function getFeaturedUnit() {
  const featured = await prisma.unit.findFirst({
    where: { published: true, featured: true },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }, { id: "desc" }],
  });

  if (featured) return formatUnitListItem(featured);

  const newest = await prisma.unit.findFirst({
    where: { published: true },
    include: { category: true },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  if (!newest) throw new AppError(404, "No units available");
  return formatUnitListItem(newest);
}

export async function listUnitCategories() {
  return prisma.unitCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function listAllUnitCategories() {
  return prisma.unitCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { units: true } } },
  });
}

export async function getUnitCategory(id: number) {
  const category = await prisma.unitCategory.findUnique({
    where: { id },
    include: { _count: { select: { units: true } } },
  });
  if (!category) throw new AppError(404, "Unit category not found");
  return category;
}

export async function createUnitCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}) {
  const slug = data.slug || slugify(data.name);

  const existing = await prisma.unitCategory.findUnique({ where: { slug } });
  if (existing) throw new AppError(409, `Category with slug "${slug}" already exists`);

  return prisma.unitCategory.create({
    data: {
      name: data.name,
      slug,
      description: data.description ?? null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    },
  });
}

export async function updateUnitCategory(
  id: number,
  data: Partial<{
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  const existing = await prisma.unitCategory.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Unit category not found");

  if (data.slug && data.slug !== existing.slug) {
    const conflict = await prisma.unitCategory.findUnique({ where: { slug: data.slug } });
    if (conflict) throw new AppError(409, `Category with slug "${data.slug}" already exists`);
  }

  return prisma.unitCategory.update({
    where: { id },
    data: {
      ...data,
      description: data.description === undefined ? undefined : data.description ?? null,
    },
  });
}

export async function deleteUnitCategory(id: number) {
  const existing = await prisma.unitCategory.findUnique({
    where: { id },
    include: { _count: { select: { units: true } } },
  });
  if (!existing) throw new AppError(404, "Unit category not found");
  if (existing._count.units > 0) {
    throw new AppError(
      409,
      `Cannot delete category "${existing.name}" — ${existing._count.units} unit(s) assigned to it. Reassign or delete them first.`
    );
  }
  await prisma.unitCategory.delete({ where: { id } });
}

export async function createUnit(data: UnitWriteInput, files?: UnitUploadFiles) {
  const slug = data.slug || (await slugify(data.title));

  const mediaFields = await resolveMediaFields(data, files, slug);
  const dbData = mapWriteInputToDb(data, mediaFields);

  const unit = await prisma.$transaction(async (tx) => {
    if (dbData.featured) {
      await tx.unit.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
    }

    return tx.unit.create({
      data: { ...dbData, slug },
      include: { category: true },
    });
  });

  return formatUnitDetail(unit);
}

export async function updateUnit(
  id: number,
  data: Partial<UnitWriteInput>,
  files?: UnitUploadFiles
) {
  const existing = await prisma.unit.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Unit not found");

  const unitSlug = data.slug || (data.title ? await slugify(data.title) : existing.slug);

  const mediaFields = await resolveMediaFields(data, files, unitSlug, existing);

  const updateData: Record<string, unknown> = {};

  if (data.code !== undefined) updateData.code = data.code.trim();
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.objectives !== undefined) updateData.objectives = data.objectives.map((obj) => sanitizeText(obj));
  if (data.duties !== undefined) updateData.duties = data.duties.map((duty) => sanitizeText(duty));
  if (data.actionPlan !== undefined) updateData.actionPlan = data.actionPlan.map((ap) => ({
    sn: ap.sn,
    activity: sanitizeText(ap.activity),
    byWhen: sanitizeText(ap.byWhen),
    byWho: sanitizeText(ap.byWho),
    budget: sanitizeText(ap.budget),
  }));
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.published !== undefined) updateData.published = data.published;
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

  if (data.slug) {
    updateData.slug = data.slug;
  } else if (data.title) {
    updateData.slug = unitSlug;
  }

  Object.assign(updateData, mediaFields);

  const unit = await prisma.$transaction(async (tx) => {
    if (updateData.featured) {
      await tx.unit.updateMany({
        where: { featured: true, id: { not: id } },
        data: { featured: false },
      });
    }

    await tx.unit.update({ where: { id }, data: updateData });
    return tx.unit.findUniqueOrThrow({
      where: { id },
      include: { category: true },
    });
  });

  return formatUnitDetail(unit);
}

export async function uploadUnitIconFile(id: number, file: Express.Multer.File) {
  const existing = await prisma.unit.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Unit not found");

  if (existing.iconCloudinaryId) {
    await deleteCloudinaryAsset(existing.iconCloudinaryId, "image");
  }

  const upload = await uploadUnitIcon(file, existing.slug);
  const unit = await prisma.unit.update({
    where: { id },
    data: {
      iconUrl: upload.url,
      iconCloudinaryId: upload.publicId,
    },
    include: { category: true },
  });

  return formatUnitDetail(unit);
}

export async function removeUnitIcon(id: number) {
  const existing = await prisma.unit.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Unit not found");

  if (existing.iconCloudinaryId) {
    await deleteCloudinaryAsset(existing.iconCloudinaryId, "image");
  }

  const unit = await prisma.unit.update({
    where: { id },
    data: {
      iconUrl: null,
      iconCloudinaryId: null,
    },
    include: { category: true },
  });

  return formatUnitDetail(unit);
}

export async function deleteUnit(id: number) {
  const existing = await prisma.unit.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Unit not found");

  if (existing.iconCloudinaryId) {
    await deleteCloudinaryAsset(existing.iconCloudinaryId, "image");
  }

  await prisma.unit.delete({ where: { id } });
}
