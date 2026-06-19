import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/apiResponse";
import { slugify } from "../../utils/slug";

// ── Staff Categories ──

export async function listStaffCategories(activeOnly = false) {
  return prisma.staffCategory.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { _count: { select: { staff: true } } },
  });
}

export async function getStaffCategory(id: number) {
  const category = await prisma.staffCategory.findUnique({
    where: { id },
    include: { _count: { select: { staff: true } } },
  });
  if (!category) throw new AppError(404, "Staff category not found");
  return category;
}

export async function createStaffCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}) {
  const slug = data.slug || slugify(data.name);

  const existing = await prisma.staffCategory.findUnique({ where: { slug } });
  if (existing) throw new AppError(409, `Category with slug "${slug}" already exists`);

  return prisma.staffCategory.create({
    data: {
      name: data.name,
      slug,
      description: data.description ?? null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    },
  });
}

export async function updateStaffCategory(
  id: number,
  data: Partial<{
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  const existing = await prisma.staffCategory.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Staff category not found");

  if (data.slug && data.slug !== existing.slug) {
    const conflict = await prisma.staffCategory.findUnique({ where: { slug: data.slug } });
    if (conflict) throw new AppError(409, `Category with slug "${data.slug}" already exists`);
  }

  return prisma.staffCategory.update({
    where: { id },
    data: {
      ...data,
      description: data.description === undefined ? undefined : data.description ?? null,
    },
  });
}

export async function deleteStaffCategory(id: number) {
  const existing = await prisma.staffCategory.findUnique({
    where: { id },
    include: { _count: { select: { staff: true } } },
  });
  if (!existing) throw new AppError(404, "Staff category not found");
  if (existing._count.staff > 0) {
    throw new AppError(409, `Cannot delete category "${existing.name}" — ${existing._count.staff} staff member(s) assigned to it. Reassign or delete them first.`);
  }
  await prisma.staffCategory.delete({ where: { id } });
}

// ── Faculty Departments ──

export async function listFacultyDepartments(activeOnly = false) {
  return prisma.facultyDepartment.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { _count: { select: { faculty: true } } },
  });
}

export async function getFacultyDepartment(id: number) {
  const department = await prisma.facultyDepartment.findUnique({
    where: { id },
    include: { _count: { select: { faculty: true } } },
  });
  if (!department) throw new AppError(404, "Faculty department not found");
  return department;
}

export async function createFacultyDepartment(data: {
  name: string;
  slug?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}) {
  const slug = data.slug || slugify(data.name);

  const existing = await prisma.facultyDepartment.findUnique({ where: { slug } });
  if (existing) throw new AppError(409, `Department with slug "${slug}" already exists`);

  return prisma.facultyDepartment.create({
    data: {
      name: data.name,
      slug,
      description: data.description ?? null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    },
  });
}

export async function updateFacultyDepartment(
  id: number,
  data: Partial<{
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  const existing = await prisma.facultyDepartment.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Faculty department not found");

  if (data.slug && data.slug !== existing.slug) {
    const conflict = await prisma.facultyDepartment.findUnique({ where: { slug: data.slug } });
    if (conflict) throw new AppError(409, `Department with slug "${data.slug}" already exists`);
  }

  return prisma.facultyDepartment.update({
    where: { id },
    data: {
      ...data,
      description: data.description === undefined ? undefined : data.description ?? null,
    },
  });
}

export async function deleteFacultyDepartment(id: number) {
  const existing = await prisma.facultyDepartment.findUnique({
    where: { id },
    include: { _count: { select: { faculty: true } } },
  });
  if (!existing) throw new AppError(404, "Faculty department not found");
  if (existing._count.faculty > 0) {
    throw new AppError(409, `Cannot delete department "${existing.name}" — ${existing._count.faculty} faculty member(s) assigned to it. Reassign or delete them first.`);
  }
  await prisma.facultyDepartment.delete({ where: { id } });
}
