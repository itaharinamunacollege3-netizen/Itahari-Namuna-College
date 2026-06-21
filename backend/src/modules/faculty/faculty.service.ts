import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/apiResponse";
import { formatFacultyForApi, formatFacultyGrouped } from "./faculty.formatter";
import { deletePhoto } from "../../config/upload";

const FACULTY_INCLUDE = { department: true };

export async function listFacultyPublic(departmentSlug?: string) {
  const where: Record<string, unknown> = { published: true };

  if (departmentSlug) {
    const numId = Number(departmentSlug);
    if (!isNaN(numId)) {
      where.departmentId = numId;
    } else {
      where.department = { slug: departmentSlug };
    }
  }

  const facultyList = await prisma.faculty.findMany({
    where,
    include: FACULTY_INCLUDE,
    orderBy: [{ isHOD: "desc" }, { sortOrder: "asc" }, { id: "asc" }],
  });

  if (departmentSlug) {
    return facultyList.map(formatFacultyForApi);
  }

  return formatFacultyGrouped(facultyList);
}

export async function listFacultyAdmin(params: {
  page: number;
  limit: number;
  department?: string;
  search?: string;
}) {
  const { page, limit, department, search } = params;
  const where: Record<string, unknown> = {};

  if (department) {
    const numId = Number(department);
    if (!isNaN(numId)) {
      where.departmentId = numId;
    } else {
      where.department = { slug: department };
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { designation: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.faculty.findMany({
      where,
      include: FACULTY_INCLUDE,
      orderBy: [{ isHOD: "desc" }, { sortOrder: "asc" }, { id: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.faculty.count({ where }),
  ]);

  return {
    items: items.map(formatFacultyForApi),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    
  };
}

export async function getFacultyById(id: number, publishedOnly = true) { 
  const faculty = await prisma.faculty.findFirst({
    where: { id, ...(publishedOnly ? { published: true } : {}) },
    include: FACULTY_INCLUDE,
  });
  if (!faculty) throw new AppError(404, "Faculty member not found");
  return formatFacultyForApi(faculty);
}

export async function createFaculty(data: {
  name: string;
  designation: string;
  departmentId: number;
  qualification?: string;
  bio?: string;
  photo?: string;
  isHOD: boolean;
  sortOrder: number;
  published: boolean;
}) {
  // Verify the department exists
  const deptExists = await prisma.facultyDepartment.findUnique({ where: { id: data.departmentId } });
  if (!deptExists) throw new AppError(400, "Invalid departmentId — department not found");

  const faculty = await prisma.faculty.create({
    data: {
      name: data.name,
      designation: data.designation,
      departmentId: data.departmentId,
      qualification: data.qualification ?? null,
      bio: data.bio ?? null,
      photo: data.photo ?? null,
      isHOD: data.isHOD,
      sortOrder: data.sortOrder,
      published: data.published,
    },
    include: FACULTY_INCLUDE,
  });

  return formatFacultyForApi(faculty);
}

export async function updateFaculty(
  id: number,
  data: Partial<{
    name: string;
    designation: string;
    departmentId: number;
    qualification?: string;
    bio?: string;
    photo?: string;
    isHOD: boolean;
    sortOrder: number;
    published: boolean;
  }>
) {
  const existing = await prisma.faculty.findUnique({ where: { id }, include: FACULTY_INCLUDE });
  if (!existing) throw new AppError(404, "Faculty member not found");

  // Verify the new department exists if changing
  if (data.departmentId && data.departmentId !== existing.departmentId) {
    const deptExists = await prisma.facultyDepartment.findUnique({ where: { id: data.departmentId } });
    if (!deptExists) throw new AppError(400, "Invalid departmentId — department not found");
  }

  // If a new photo is uploaded, delete the old one
  if (data.photo && existing.photo && data.photo !== existing.photo) {
    deletePhoto(existing.photo);
  }

  const faculty = await prisma.faculty.update({
    where: { id },
    data: {
      ...data,
      qualification: data.qualification === undefined ? undefined : data.qualification ?? null,
      bio: data.bio === undefined ? undefined : data.bio ?? null,
      photo: data.photo === undefined ? undefined : data.photo ?? null,
    },
    include: FACULTY_INCLUDE,
  });

  return formatFacultyForApi(faculty);
}

export async function deleteFaculty(id: number) {
  const existing = await prisma.faculty.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Faculty member not found");

  // Delete the photo file from disk before removing the DB record
  deletePhoto(existing.photo);

  await prisma.faculty.delete({ where: { id } });
}
