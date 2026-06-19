import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/apiResponse";
import { formatStaffForApi, formatStaffGrouped } from "./staff.formatter";
import { deletePhoto } from "../../config/upload";

const STAFF_INCLUDE = { category: true };

export async function listStaffPublic(categorySlug?: string) {
  const where: Record<string, unknown> = { published: true };

  if (categorySlug) {
    // Support filtering by category slug or numeric id
    const numId = Number(categorySlug);
    if (!isNaN(numId)) {
      where.categoryId = numId;
    } else {
      where.category = { slug: categorySlug };
    }
  }

  const staffList = await prisma.staff.findMany({
    where,
    include: STAFF_INCLUDE,
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  if (categorySlug) {
    return staffList.map(formatStaffForApi);
  }

  return formatStaffGrouped(staffList);
}

export async function listStaffAdmin(params: {
  page: number;
  limit: number;
  category?: string;
  search?: string;
}) {
  const { page, limit, category, search } = params;
  const where: Record<string, unknown> = {};

  if (category) {
    const numId = Number(category);
    if (!isNaN(numId)) {
      where.categoryId = numId;
    } else {
      where.category = { slug: category };
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { role: { contains: search, mode: "insensitive" } },
      { department: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.staff.findMany({
      where,
      include: STAFF_INCLUDE,
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.staff.count({ where }),
  ]);

  return {
    items: items.map(formatStaffForApi),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getStaffById(id: number, publishedOnly = true) {
  const staff = await prisma.staff.findFirst({
    where: { id, ...(publishedOnly ? { published: true } : {}) },
    include: STAFF_INCLUDE,
  });
  if (!staff) throw new AppError(404, "Staff member not found");
  return formatStaffForApi(staff);
}

export async function createStaff(data: {
  name: string;
  role: string;
  department?: string;
  categoryId: number;
  photo?: string;
  sortOrder: number;
  published: boolean;
}) {
  // Verify the category exists
  const categoryExists = await prisma.staffCategory.findUnique({ where: { id: data.categoryId } });
  if (!categoryExists) throw new AppError(400, "Invalid categoryId — category not found");

  const staff = await prisma.staff.create({
    data: {
      name: data.name,
      role: data.role,
      department: data.department ?? null,
      categoryId: data.categoryId,
      photo: data.photo ?? null,
      sortOrder: data.sortOrder,
      published: data.published,
    },
    include: STAFF_INCLUDE,
  });

  return formatStaffForApi(staff);
}

export async function updateStaff(
  id: number,
  data: Partial<{
    name: string;
    role: string;
    department?: string;
    categoryId: number;
    photo?: string;
    sortOrder: number;
    published: boolean;
  }>
) {
  const existing = await prisma.staff.findUnique({ where: { id }, include: STAFF_INCLUDE });
  if (!existing) throw new AppError(404, "Staff member not found");

  // Verify the new category exists if changing
  if (data.categoryId && data.categoryId !== existing.categoryId) {
    const categoryExists = await prisma.staffCategory.findUnique({ where: { id: data.categoryId } });
    if (!categoryExists) throw new AppError(400, "Invalid categoryId — category not found");
  }

  // If a new photo is uploaded, delete the old one
  if (data.photo && existing.photo && data.photo !== existing.photo) {
    deletePhoto(existing.photo);
  }

  const staff = await prisma.staff.update({
    where: { id },
    data: {
      ...data,
      department: data.department === undefined ? undefined : data.department ?? null,
      photo: data.photo === undefined ? undefined : data.photo ?? null,
    },
    include: STAFF_INCLUDE,
  });

  return formatStaffForApi(staff);
}

export async function deleteStaff(id: number) {
  const existing = await prisma.staff.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Staff member not found");

  // Delete the photo file from disk before removing the DB record
  deletePhoto(existing.photo);

  await prisma.staff.delete({ where: { id } });
}
