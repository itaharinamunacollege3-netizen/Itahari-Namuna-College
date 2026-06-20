import type { Faculty, FacultyDepartment } from "../../generated/prisma/client";

type FacultyWithDepartment = Faculty & { department?: FacultyDepartment | null };

export function formatFacultyForApi(faculty: FacultyWithDepartment) {
  return {
    id: faculty.id,
    name: faculty.name,
    role: faculty.designation,
    department: faculty.department
      ? { id: faculty.department.id, name: faculty.department.name, slug: faculty.department.slug }
      : null,
    isHead: faculty.isHOD,
    image: faculty.photo,
    qualification: faculty.qualification,
    bio: faculty.bio,
    sortOrder: faculty.sortOrder,
    published: faculty.published,
  };
}

export function formatFacultyGrouped(facultyList: FacultyWithDepartment[]) {
  const grouped: Record<string, ReturnType<typeof formatFacultyForApi>[]> = {};

  for (const member of facultyList) {
    const key = member.department?.slug ?? "uncategorized";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(formatFacultyForApi(member));
  }

  return grouped;
}
